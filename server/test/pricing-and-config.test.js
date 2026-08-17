import assert from "node:assert/strict";
import test from "node:test";

import { calculateEstimate } from "../src/services/calculator.js";
import { validateConfigPayload, ValidationError } from "../src/utils/validators.js";
import { business, modifiers, questions } from "../src/seed/data.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test("calculates the documented estimate range using the seed configuration", () => {
  const result = calculateEstimate(
    { questions: clone(questions), modifiers: clone(modifiers) },
    { roof_area: 1000, material: "asphalt_arch", pitch: "medium", layers: "1", stories: "2" }
  );

  assert.equal(result.estimate_mid, 9591);
  assert.equal(result.estimate_low, 8440);
  assert.equal(result.estimate_high, 10742);
});

test("accepts legacy numeric strings in pricing data", () => {
  const config = { questions: clone(questions), modifiers: clone(modifiers) };
  config.questions.find((question) => question.key === "pitch").options[1].multiplier = "1.12";

  const result = calculateEstimate(config, {
    roof_area: "1000",
    material: "asphalt_arch",
    pitch: "medium",
    layers: "1",
    stories: "2",
  });

  assert.equal(result.estimate_mid, 9591);
});

test("rejects a configuration that disables a pricing-critical question", () => {
  const editedQuestions = clone(questions);
  editedQuestions.find((question) => question.key === "material").active = false;

  assert.throws(
    () => validateConfigPayload({ business, questions: editedQuestions, modifiers }),
    (error) => error instanceof ValidationError && error.details.some((detail) => detail.includes("cannot be disabled"))
  );
});
