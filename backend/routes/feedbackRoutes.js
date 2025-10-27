import express from "express";
import { getAllFeedback, createFeedback } from "../controller/feedbackController.js";

const router = express.Router();

// Order matters
router.get("/", getAllFeedback);
router.post("/", createFeedback);

export default router;
