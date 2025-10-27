import Feedback from "../models/Feedbaack.js";

// ✅ Get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("❌ Failed to fetch feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

// ✅ Create new feedback
export const createFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "")
      return res.status(400).json({ error: "Message is required" });

    const newFeedback = await Feedback.create({ message });
    res.status(201).json(newFeedback);
  } catch (err) {
    console.error("❌ Failed to submit feedback:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};
