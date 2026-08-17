import { getCurrentConfig, publishNewConfig } from "../services/configService.js";
import { validateConfigPayload, ValidationError } from "../utils/validators.js";
import Lead from "../models/Lead.js";

export async function getAdminConfig(req, res, next) {
  try {
    const config = await getCurrentConfig();
    res.json(config);
  } catch (err) {
    next(err);
  }
}

export async function putAdminConfig(req, res, next) {
  try {
    const { business, questions, modifiers } = req.body || {};
    validateConfigPayload({ business, questions, modifiers });

    const updated = await publishNewConfig({ business, questions, modifiers });
    res.json(updated);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, details: err.details });
    }
    next(err);
  }
}

export async function getLeads(req, res, next) {
  try {
    const leads = await Lead.find().sort({ captured_at: -1 }).lean();
    res.json(leads);
  } catch (err) {
    next(err);
  }
}
