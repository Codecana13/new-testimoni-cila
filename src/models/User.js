import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "editor"], default: "editor" },
  resetToken: { type: String, default: null }, // ✅ Store reset token
  logoUrl: { type: String, default: "/logo.png" }, // ✅ Simpan logo admin
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
