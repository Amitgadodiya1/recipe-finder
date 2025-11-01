// models/Vote.js
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" }, // ✅ optional display name
  targetType: { type: String, enum: ["doubt", "reply"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  voteType: { type: String, enum: ["upvote", "downvote"], required: true },
}, { timestamps: true });

export default mongoose.model("Vote", voteSchema);
