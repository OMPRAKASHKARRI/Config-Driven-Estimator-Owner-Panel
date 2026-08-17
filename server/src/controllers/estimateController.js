import { getCurrentConfig, getConfigByVersion } from "../services/configService.js";
import { calculateEstimate } from "../services/calculator.js";
import { validateContact, validateAnswers, ValidationError } from "../utils/validators.js";
import Lead from "../models/Lead.js";

export async function postEstimate(req, res, next) {
  try {
    const { name, phone, email, answers, config_version } = req.body || {};

    validateContact({ name, phone, email });

    
    const config = config_version
      ? (await getConfigByVersion(config_version)) || (await getCurrentConfig())
      : await getCurrentConfig();

    validateAnswers(config, answers);

    const result = calculateEstimate(config, answers);

    const lead = await Lead.create({
      config_version: config.config_version,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      answers,
      estimate_low: result.estimate_low,
      estimate_high: result.estimate_high,
      estimate_mid: result.estimate_mid,
    });

    res.status(201).json({
      estimate_low: result.estimate_low,
      estimate_high: result.estimate_high,
      currency: config.business.currency,
      config_version: config.config_version,
      lead_id: lead._id,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, details: err.details });
    }
    next(err);
  }
}
