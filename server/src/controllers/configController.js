import { getCurrentConfig, toPublicConfig } from "../services/configService.js";

export async function getPublicConfig(req, res, next) {
  try {
    const config = await getCurrentConfig();
    res.json(toPublicConfig(config));
  } catch (err) {
    next(err);
  }
}
