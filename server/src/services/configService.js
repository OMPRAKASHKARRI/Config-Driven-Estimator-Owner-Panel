import Config from "../models/Config.js";


export async function getCurrentConfig() {
  const config = await Config.findOne({ is_current: true }).lean();
  if (!config) {
    throw new Error("No active configuration found. Run the seed script (npm run seed).");
  }
  return config;
}


export async function getConfigByVersion(version) {
  return Config.findOne({ config_version: version }).lean();
}


export async function publishNewConfig({ business, questions, modifiers }) {
  const latest = await Config.findOne().sort({ config_version: -1 }).lean();
  const nextVersion = latest ? latest.config_version + 1 : 1;

  await Config.updateMany({ is_current: true }, { $set: { is_current: false } });

  const created = await Config.create({
    config_version: nextVersion,
    business,
    questions,
    modifiers,
    is_current: true,
  });

  return created.toObject();
}


export function toPublicConfig(config) {
  return {
    config_version: config.config_version,
    business: config.business,
    questions: config.questions
      .filter((q) => q.active)
      .map((q) => ({
        key: q.key,
        label: q.label,
        type: q.type,
        unit: q.unit,
        required: q.required,
        min: q.min,
        max: q.max,
        options: q.options
          ? q.options.map((o) => ({ value: o.value, label: o.label }))
          : undefined,
      })),
  };
}
