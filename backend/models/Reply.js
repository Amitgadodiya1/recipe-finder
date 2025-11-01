// models/Reply.js
import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  doubtId: { type: mongoose.Schema.Types.ObjectId, ref: "Doubt", required: true },
  name: { type: String, default: "Anonymous" }, // ✅ optional display name
  replyText: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Reply", replySchema);
