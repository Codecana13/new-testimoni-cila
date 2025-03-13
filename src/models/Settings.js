import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  runningText: { type: String, required: true },
  aboutTitle: { type: String, required: true, default: "About This Website" }, // ✅ Store About Title
  aboutContent: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
