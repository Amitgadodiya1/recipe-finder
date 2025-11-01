import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  name: { type: String, default: "Anonymous" },  // ✅ instead of userId
  title: { type: String, required: true },
  description: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
}, { timestamps: true });


export default mongoose.model("Doubt", doubtSchema);
