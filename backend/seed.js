import mongoose from "mongoose";
import fs from "fs";
import Recipe from "./models/Recipe.js";
import dotenv from "dotenv";
dotenv.config();
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to DB");

  // Clear old data
  await Recipe.deleteMany({});

  // Load recipes.json
  const data = JSON.parse(fs.readFileSync("./recipes.json", "utf-8"));
  const allRecipes = [];

  Object.entries(data).forEach(([cuisine, dishes]) => {
    dishes.forEach(dish => {
      allRecipes.push({
        ...dish,
        cuisine
      });
    });
  });

  await Recipe.insertMany(allRecipes);
  console.log(`🍲 Inserted ${allRecipes.length} recipes`);

  mongoose.connection.close();
}

seed();
