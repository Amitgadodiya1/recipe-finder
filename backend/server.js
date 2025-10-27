import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import recipeRoutes from "./routes/recipies.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/feedback", feedbackRoutes);

// ✅ Health check route (for debugging on Vercel)
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "✅ Taste Explorer backend is live!" });
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo connection failed:", err));

// ✅ Export app for Vercel
export default app;

// ✅ Local development (only run locally, not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
