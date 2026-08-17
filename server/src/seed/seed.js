import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Config from "../models/Config.js";
import Lead from "../models/Lead.js";
import { business, questions, modifiers, historicalLeads } from "./data.js";

async function seed() {
  await connectDB();

  console.log("[seed] clearing existing Config and Lead collections...");
  await Config.deleteMany({});
  await Lead.deleteMany({});

  const config = await Config.create({
    config_version: 3,
    business,
    questions,
    modifiers,
    is_current: true,
  });
  console.log(`[seed] created config version ${config.config_version}`);

  const leadDocs = historicalLeads.map((lead) => {
    const estimateMid = Math.round((lead.estimate_low + lead.estimate_high) / 2);
    return {
      ...lead,
      estimate_mid: estimateMid,
    };
  });

  await Lead.insertMany(leadDocs);
  console.log(`[seed] inserted ${leadDocs.length} historical leads`);

  await mongoose.connection.close();
  console.log("[seed] done.");
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
