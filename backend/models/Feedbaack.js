import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // ✅ adds createdAt and updatedAt
);

export default mongoose.model("Feedback", feedbackSchema);
