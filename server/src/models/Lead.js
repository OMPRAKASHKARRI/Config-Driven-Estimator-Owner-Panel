import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    source_id: { type: String, trim: true, default: null },
    captured_at: { type: Date, default: Date.now },
    config_version: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    answers: { type: mongoose.Schema.Types.Mixed, required: true },
    estimate_low: { type: Number, required: true },
    estimate_high: { type: Number, required: true },
    estimate_mid: { type: Number, required: true },
  },
  { timestamps: true }
);

LeadSchema.index({ captured_at: -1 });

export default mongoose.model("Lead", LeadSchema);
