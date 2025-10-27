import mongoose from "mongoose";
import dotenv from "dotenv";
import Recipe from "./models/Recipe.js"; // adjust path if needed
import fs from "fs";

dotenv.config();

// 📌 MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/recipeFinder";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// 📁 Load JSON data (put your JSON in /data/recipes.json)
const rawData = fs.readFileSync("./data/recipes_transformed.json", "utf-8");
const recipeData = JSON.parse(rawData);

// Flatten data since JSON is grouped by cuisine
const flattenedRecipes = Object.entries(recipeData).flatMap(([cuisine, recipes]) => {
  return recipes.map((recipe) => ({
    ...recipe,
    cuisine, // ensure cuisine field is always set
  }));
});

const seedData = async () => {
  try {
    await connectDB();

    // 🧹 Clear existing recipes
    await Recipe.deleteMany();
    console.log("🗑️  Old recipes cleared");

    // 🌱 Insert new recipes
    const inserted = await Recipe.insertMany(flattenedRecipes);
    console.log(`✅ ${inserted.length} recipes inserted successfully!`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
