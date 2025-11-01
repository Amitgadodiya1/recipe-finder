import express from "express";
import Doubt from "../models/Doubt.js";
import Reply from "../models/Reply.js";
import Vote from "../models/Vote.js";

const router = express.Router();

/**
 * POST /api/doubts
 * Create a new doubt (guest or named)
 */
// ✅ recipeId is optional
router.post("/", async (req, res) => {
  try {
    const { recipeId, title, description, name } = req.body;

    const doubt = await Doubt.create({
      recipeId: recipeId || null,
      title,
      description,
      name: name || "Anonymous",
    });

    res.status(201).json({ message: "Doubt created successfully", doubt });
  } catch (err) {
    console.error("Error creating doubt:", err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * GET /api/doubts/:recipeId
 * Get all doubts for a recipe (with replies)
 */
// Global doubts
router.get("/", async (req, res) => {
  const doubts = await Doubt.find({ recipeId: null }).sort({ createdAt: -1 });
  res.json(doubts);
});

// Recipe-specific doubts
router.get("/:recipeId", async (req, res) => {
  const doubts = await Doubt.find({ recipeId: req.params.recipeId }).sort({ createdAt: -1 });
  res.json(doubts);
});


/**
 * POST /api/doubts/:id/reply
 * Add a reply (guest or named)
 */
router.post("/:id/reply", async (req, res) => {
  try {
    const { replyText, name } = req.body;
    const reply = await Reply.create({
      doubtId: req.params.id,
      replyText,
      name: name || "Anonymous",
    });
    res.status(201).json({ message: "Reply added successfully", reply });
  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/doubts/vote
 * Handle upvote/downvote (no userId, open voting)
 */
router.post("/vote", async (req, res) => {
  try {
    const { targetType, targetId, voteType } = req.body;

    const Model = targetType === "doubt" ? Doubt : Reply;
    const field = voteType === "upvote" ? "upvotes" : "downvotes";

    await Model.findByIdAndUpdate(targetId, { $inc: { [field]: 1 } });

    res.json({ message: `${voteType} recorded successfully` });
  } catch (err) {
    console.error("Error voting:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
