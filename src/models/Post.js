import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    author: { type: String, required: true }, // Stores the email of the author
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
