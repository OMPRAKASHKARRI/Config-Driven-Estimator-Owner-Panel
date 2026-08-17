const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts things like +1-614-555-0000, (614) 555-0000, 6145550000 etc.
const PHONE_RE = /^[+]?[\d()\-.\s]{7,20}$/;

export class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.details = details;
  }
}

export function validateContact({ name, phone, email }) {
  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name is required (at least 2 characters).");
  }
  if (!phone || typeof phone !== "string" || !PHONE_RE.test(phone.trim())) {
    errors.push("A valid phone number is required.");
  }
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    errors.push("A valid email address is required.");
  }
  if (errors.length) {
    throw new ValidationError("Invalid contact information", errors);
  }
}

/**
 * Validate a submitted `answers` object against the ACTIVE questions in a
 * given config document. Throws ValidationError with a list of human
 * readable problems if anything is wrong. Never trusts the client.
 */
export function validateAnswers(config, answers) {
  const errors = [];

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    throw new ValidationError("Answers must be an object.");
  }

  const activeQuestions = config.questions.filter((q) => q.active);
  const activeKeys = new Set(activeQuestions.map((q) => q.key));

  // Reject unknown keys - the frontend should only ever send keys we handed it.
  for (const key of Object.keys(answers)) {
    if (!activeKeys.has(key)) {
      errors.push(`Unknown or inactive question key: "${key}".`);
    }
  }

  for (const question of activeQuestions) {
    const value = answers[question.key];
    const isMissing = value === undefined || value === null || value === "";

    if (question.required && isMissing) {
      errors.push(`"${question.label}" is required.`);
      continue;
    }
    if (isMissing) continue; // optional and not provided

    if (question.type === "number") {
      const num = Number(value);
      if (!Number.isFinite(num)) {
        errors.push(`"${question.label}" must be a number.`);
        continue;
      }
      if (question.min !== null && question.min !== undefined && num < Number(question.min)) {
        errors.push(`"${question.label}" must be at least ${question.min}${question.unit ? " " + question.unit : ""}.`);
      }
      if (question.max !== null && question.max !== undefined && num > Number(question.max)) {
        errors.push(`"${question.label}" must be at most ${question.max}${question.unit ? " " + question.unit : ""}.`);
      }
    }

    if (question.type === "select") {
      const validValues = (question.options || []).map((o) => String(o.value));
      if (!validValues.includes(String(value))) {
        errors.push(`"${question.label}" has an invalid selection.`);
      }
    }
  }

  if (errors.length) {
    throw new ValidationError("Invalid answers", errors);
  }
}

/**
 * Validate a full config payload before it is saved by the admin.
 * Keeps checks lightweight but catches the mistakes that would otherwise
 * silently break the public estimator or the calculator.
 */
export function validateConfigPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== "object") {
    throw new ValidationError("Configuration payload must be an object.");
  }

  const { business, questions, modifiers } = payload;

  if (!business || !business.name || !business.region || !business.currency) {
    errors.push("Business info must include name, region, and currency.");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push("Questions must be a non-empty array.");
  } else {
    const keys = new Set();
    for (const q of questions) {
      if (!q.key || !q.label || !q.type) {
        errors.push(`Every question needs a key, label, and type (problem near "${q.label || q.key || "unnamed"}").`);
        continue;
      }
      if (keys.has(q.key)) {
        errors.push(`Duplicate question key: "${q.key}".`);
      }
      keys.add(q.key);

      if (q.type === "select") {
        if (!Array.isArray(q.options) || q.options.length === 0) {
          errors.push(`Question "${q.label}" is a select but has no options.`);
        } else {
          for (const opt of q.options) {
            if (!opt.value || !opt.label) {
              errors.push(`An option on "${q.label}" is missing a value or label.`);
            }
            for (const numField of ["rate_per_sqft", "multiplier", "tear_off_per_sqft"]) {
              if (opt[numField] !== undefined && opt[numField] !== null && opt[numField] !== "") {
                const n = Number(opt[numField]);
                if (!Number.isFinite(n)) {
                  errors.push(`Option "${opt.label || opt.value}" on "${q.label}" has a non-numeric ${numField}.`);
                }
              }
            }
          }
        }
      }

      if (q.type === "number") {
        if (q.min !== null && q.min !== undefined && q.min !== "" && !Number.isFinite(Number(q.min))) {
          errors.push(`Question "${q.label}" has a non-numeric min.`);
        }
        if (q.max !== null && q.max !== undefined && q.max !== "" && !Number.isFinite(Number(q.max))) {
          errors.push(`Question "${q.label}" has a non-numeric max.`);
        }
      }
    }

    const requiredKeys = ["roof_area", "material", "pitch", "layers", "stories"];
    for (const rk of requiredKeys) {
      const pricingQuestion = questions.find((question) => question.key === rk);
      if (!pricingQuestion) {
        errors.push(`The pricing engine requires a question with key "${rk}".`);
      } else if (!pricingQuestion.active) {
        errors.push(`The pricing question "${pricingQuestion.label}" cannot be disabled.`);
      }
    }
  }

  if (!modifiers) {
    errors.push("Modifiers are required.");
  } else {
    for (const field of ["waste_factor", "permit_flat_fee", "range_spread_pct"]) {
      const v = modifiers[field];
      if (v === undefined || v === null || v === "" || !Number.isFinite(Number(v))) {
        errors.push(`Modifier "${field}" must be a number.`);
      }
    }
  }

  if (errors.length) {
    throw new ValidationError("Invalid configuration", errors);
  }
}
