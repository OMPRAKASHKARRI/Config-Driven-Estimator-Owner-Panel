import { useEffect, useState } from "react";
import { fetchConfig, submitEstimate } from "../services/api.js";
import DynamicQuestion from "../components/dynamic/DynamicQuestion.jsx";
import ProgressBar from "../components/estimator/ProgressBar.jsx";
import ContactStep from "../components/estimator/ContactStep.jsx";
import ResultStep from "../components/estimator/ResultStep.jsx";

const CONTACT_STEP = "contact";
const RESULT_STEP = "result";

export default function EstimatorPage() {
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [stepIndex, setStepIndex] = useState(0); // index into questions[]; then contact; then result
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchConfig()
      .then(setConfig)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoadingConfig(false));
  }, []);

  if (loadingConfig) {
    return <CenteredMessage title="Loading estimator..." />;
  }

  if (loadError || !config) {
    return (
      <CenteredMessage
        title="We couldn't load the estimator"
        subtitle={loadError || "Please try again shortly."}
      />
    );
  }

  const questions = config.questions; // fully driven by the API response
  const totalSteps = questions.length + 1; // + contact step
  const currentPhase = stepIndex < questions.length ? "question" : stepIndex === questions.length ? CONTACT_STEP : RESULT_STEP;

  function handleAnswerChange(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleContactChange(field, value) {
    setContact((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateCurrentQuestion() {
    const q = questions[stepIndex];
    const value = answers[q.key];
    if (q.required && (value === undefined || value === null || value === "")) {
      setFieldErrors({ [q.key]: "This field is required." });
      return false;
    }
    if (q.type === "number" && value !== undefined && value !== "") {
      const num = Number(value);
      if (Number.isNaN(num)) {
        setFieldErrors({ [q.key]: "Please enter a valid number." });
        return false;
      }
      if (q.min !== null && num < q.min) {
        setFieldErrors({ [q.key]: `Must be at least ${q.min}.` });
        return false;
      }
      if (q.max !== null && num > q.max) {
        setFieldErrors({ [q.key]: `Must be at most ${q.max}.` });
        return false;
      }
    }
    return true;
  }

  function validateContact() {
    const errors = {};
    if (!contact.name || contact.name.trim().length < 2) errors.name = "Please enter your name.";
    if (!contact.phone || contact.phone.trim().length < 7) errors.phone = "Please enter a valid phone number.";
    if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errors.email = "Please enter a valid email address.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleNext() {
    if (currentPhase === "question") {
      if (!validateCurrentQuestion()) return;
      setStepIndex((i) => i + 1);
      return;
    }

    if (currentPhase === CONTACT_STEP) {
      if (!validateContact()) return;
      setSubmitting(true);
      setSubmitError(null);
      try {
        const payload = {
          ...contact,
          answers,
          config_version: config.config_version,
        };
        const res = await submitEstimate(payload);
        setResult(res);
        setStepIndex((i) => i + 1);
      } catch (err) {
        setSubmitError(err.details?.join(" ") || err.message);
      } finally {
        setSubmitting(false);
      }
    }
  }

  function handleBack() {
    setFieldErrors({});
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function handleStartOver() {
    setAnswers({});
    setContact({ name: "", phone: "", email: "" });
    setResult(null);
    setSubmitError(null);
    setFieldErrors({});
    setStepIndex(0);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-brand-800">{config.business.name}</h1>
        <p className="text-sm text-gray-500">{config.business.region} · Free instant estimate</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
        {currentPhase !== RESULT_STEP && <ProgressBar current={stepIndex + 1} total={totalSteps} />}

        {currentPhase === "question" && (
          <DynamicQuestion
            question={questions[stepIndex]}
            value={answers[questions[stepIndex].key]}
            onChange={handleAnswerChange}
            error={fieldErrors[questions[stepIndex].key]}
          />
        )}

        {currentPhase === CONTACT_STEP && (
          <ContactStep contact={contact} onChange={handleContactChange} errors={fieldErrors} />
        )}

        {currentPhase === RESULT_STEP && result && (
          <ResultStep result={result} businessName={config.business.name} onStartOver={handleStartOver} />
        )}

        {submitError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
        )}

        {currentPhase !== RESULT_STEP && (
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="rounded-lg px-5 py-2.5 font-medium text-gray-500 disabled:opacity-0"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="rounded-lg bg-brand-600 px-6 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Calculating..." : currentPhase === CONTACT_STEP ? "Get my estimate" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CenteredMessage({ title, subtitle }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl font-semibold text-brand-800">{title}</h1>
      {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
    </div>
  );
}
