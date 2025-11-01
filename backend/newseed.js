import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Recipe from "./models/Recipe.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/recipeFinder";

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// Load JSON
const rawData = fs.readFileSync(
  "./data/recipes_with_detailed_procedure_and_cloudinary.json",
  "utf-8"
);
const recipeData = JSON.parse(rawData);

// Flatten all cuisines safely
const flattenedRecipes = Object.entries(recipeData).flatMap(
  ([cuisine, recipes]) => {
    return recipes.flatMap((recipe) => {
      // Handle nested "Indian": [ … ] inside "Indian"
      if (recipe && typeof recipe === "object" && !recipe.name) {
        const nestedKey = Object.keys(recipe).find(
          (key) => Array.isArray(recipe[key])
        );
        if (nestedKey) {
          return recipe[nestedKey].map((r) => ({
            ...r,
            cuisine,
            calories: r.calories ?? 0,
            image: r.image || null,
            ingredients: Array.isArray(r.ingredients)
              ? r.ingredients.map((i) =>
                  typeof i === "string" ? i.trim() : i.name
                )
              : [],
          }));
        }
        return []; // skip malformed entries
      }

      // Normal recipe
      return {
        ...recipe,
        cuisine,
        calories: recipe.calories ?? 0,
        image: recipe.image || null,
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients.map((i) =>
              typeof i === "string" ? i.trim() : i.name
            )
          : [],
      };
    });
  }
);

// Filter out invalid or missing-name entries
const validRecipes = flattenedRecipes.filter(
  (r) => r && r.name && r.name.trim() !== ""
);

const seedData = async () => {
  try {
    await connectDB();

    await Recipe.deleteMany();
    console.log("🗑️  Existing recipes removed");

    const inserted = await Recipe.insertMany(validRecipes);
    console.log(`✅ ${inserted.length} recipes inserted successfully!`);

    const skipped = flattenedRecipes.length - validRecipes.length;
    if (skipped > 0)
      console.warn(`⚠️  Skipped ${skipped} entries without a valid name`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
