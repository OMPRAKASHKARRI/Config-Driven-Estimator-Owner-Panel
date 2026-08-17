export function toNumber(value, fieldNameForError = "value") {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`Config error: ${fieldNameForError} is not a finite number`);
    }
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.trim());
    if (!Number.isFinite(parsed)) {
      throw new Error(`Config error: ${fieldNameForError} ("${value}") is not numeric`);
    }
    return parsed;
  }
  throw new Error(`Config error: ${fieldNameForError} is missing or not numeric`);
}

function findQuestion(config, key) {
  return config.questions.find((q) => q.key === key);
}

function findOption(question, value) {
  if (!question.options) return undefined;
  return question.options.find((o) => o.value === String(value));
}

export function calculateEstimate(config, answers) {
  const modifiers = config.modifiers;

  const roofAreaQuestion = findQuestion(config, "roof_area");
  const materialQuestion = findQuestion(config, "material");
  const pitchQuestion = findQuestion(config, "pitch");
  const layersQuestion = findQuestion(config, "layers");
  const storiesQuestion = findQuestion(config, "stories");

  if (!roofAreaQuestion || !materialQuestion || !pitchQuestion || !layersQuestion || !storiesQuestion) {
    throw new Error("Config error: one or more required pricing questions are missing from the active configuration");
  }

  const roofArea = toNumber(answers.roof_area, "roof_area");

  const materialOption = findOption(materialQuestion, answers.material);
  const pitchOption = findOption(pitchQuestion, answers.pitch);
  const layersOption = findOption(layersQuestion, answers.layers);
  const storiesOption = findOption(storiesQuestion, answers.stories);

  if (!materialOption) throw new Error("Invalid option selected for material");
  if (!pitchOption) throw new Error("Invalid option selected for pitch");
  if (!layersOption) throw new Error("Invalid option selected for layers");
  if (!storiesOption) throw new Error("Invalid option selected for stories");

  const materialRate = toNumber(materialOption.rate_per_sqft, "material.rate_per_sqft");
  const pitchMultiplier = toNumber(pitchOption.multiplier, "pitch.multiplier");
  const tearOffRate = toNumber(layersOption.tear_off_per_sqft, "layers.tear_off_per_sqft");
  const storiesMultiplier = toNumber(storiesOption.multiplier, "stories.multiplier");

  const wasteFactor = toNumber(modifiers.waste_factor, "modifiers.waste_factor");
  const permitFlatFee = toNumber(modifiers.permit_flat_fee, "modifiers.permit_flat_fee");
  const rawRangeSpread = toNumber(modifiers.range_spread_pct, "modifiers.range_spread_pct");
  const rangeSpreadFraction = rawRangeSpread > 1 ? rawRangeSpread / 100 : rawRangeSpread;

  const baseMaterialCost = roofArea * materialRate * (1 + wasteFactor);
  const tearOffCost = roofArea * tearOffRate;

  const adjustedSubtotal = (baseMaterialCost + tearOffCost) * pitchMultiplier * storiesMultiplier;

  const midEstimate = adjustedSubtotal + permitFlatFee;

  const lowEstimate = midEstimate * (1 - rangeSpreadFraction);
  const highEstimate = midEstimate * (1 + rangeSpreadFraction);

  return {
    estimate_low: Math.round(lowEstimate),
    estimate_high: Math.round(highEstimate),
    estimate_mid: Math.round(midEstimate),
    breakdown: {
      roof_area: roofArea,
      material_rate: materialRate,
      waste_factor: wasteFactor,
      tear_off_rate: tearOffRate,
      pitch_multiplier: pitchMultiplier,
      stories_multiplier: storiesMultiplier,
      permit_flat_fee: permitFlatFee,
      range_spread_pct: rangeSpreadFraction,
      base_material_cost: Math.round(baseMaterialCost * 100) / 100,
      tear_off_cost: Math.round(tearOffCost * 100) / 100,
      adjusted_subtotal: Math.round(adjustedSubtotal * 100) / 100,
    },
  };
}
