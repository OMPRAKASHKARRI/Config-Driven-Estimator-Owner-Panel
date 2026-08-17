import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    // Any of these may be present depending on which question this option belongs to.
    rate_per_sqft: { type: mongoose.Schema.Types.Mixed },
    multiplier: { type: mongoose.Schema.Types.Mixed },
    tear_off_per_sqft: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["number", "select", "text"] },
    unit: { type: String, default: null },
    required: { type: Boolean, default: true },
    min: { type: mongoose.Schema.Types.Mixed, default: null },
    max: { type: mongoose.Schema.Types.Mixed, default: null },
    active: { type: Boolean, default: true },
    options: { type: [OptionSchema], default: undefined },
  },
  { _id: false }
);

const ModifiersSchema = new mongoose.Schema(
  {
    waste_factor: { type: mongoose.Schema.Types.Mixed, required: true },
    permit_flat_fee: { type: mongoose.Schema.Types.Mixed, required: true },
    range_spread_pct: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const BusinessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    region: { type: String, required: true },
    currency: { type: String, required: true, default: "USD" },
  },
  { _id: false }
);

const ConfigSchema = new mongoose.Schema(
  {
    config_version: { type: Number, required: true, unique: true },
    business: { type: BusinessSchema, required: true },
    questions: { type: [QuestionSchema], required: true },
    modifiers: { type: ModifiersSchema, required: true },
    // Only one config document should be active (the current/live one) at a time.
    is_current: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("Config", ConfigSchema);
