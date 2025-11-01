// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import recipeRoutes from "./routes/recipies.js";
// import feedbackRoutes from "./routes/feedbackroutes.js";
// import dotenv from "dotenv";
// dotenv.config();
// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/recipes", recipeRoutes);
// app.use("/api/feedback", feedbackRoutes);

// // Connect DB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("✅ MongoDB connected"))
// .catch(err => console.error(err));

// // Start server
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));



import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import recipeRoutes from "./routes/recipies.js";
import cors from "cors";
import feedbackRoutes from "./routes/feedbackRoutes.js"; // ✅ add this
import doubtRoutes from "./routes/doubtRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend folder
app.use(express.static("../frontend"));

// Routes
app.get("/", (req, res) => {
  res.json({ 
    message: "🍽️ Recipe Finder API is running!",
    endpoints: {
      recipes: "/api/recipes",
      popular: "/api/recipes/popular",
      random: "/api/recipes/random",
      feedback: "/api/feedback"
    }
  });
});

app.use("/api/recipes", recipeRoutes);
app.use("/api/feedback", feedbackRoutes); // ✅ connect feedback
app.use("/api/doubts", doubtRoutes);


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection failed:", err));

// Start Server
const PORT = process.env.PORT || 5000;

// For local development
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export for Vercel serverless deployment
export default app;
