// import express from "express";
// import Recipe from "../models/Recipe.js";

// const router = express.Router();

// // ✅ Get most liked recipes (keep this ABOVE /:id)
// router.get("/popular", async (req, res) => {
//   try {
//     const popular = await Recipe.find().sort({ likes: -1 }).limit(4);
//     res.json(popular);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch popular recipes" });
//   }
// });

// // ✅ Increment likes
// router.post("/:id/like", async (req, res) => {
//   try {
//     const recipe = await Recipe.findByIdAndUpdate(
//       req.params.id,
//       { $inc: { likes: 1 } },
//       { new: true }
//     );
//     res.json(recipe);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to like recipe" });
//   }
// });

// // ✅ Get single recipe by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id);
//     if (!recipe) return res.status(404).json({ error: "Recipe not found" });
//     res.json(recipe);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch recipe" });
//   }
// });

// // ✅ Get all recipes
// router.get("/", async (req, res) => {
//   try {
//     const recipes = await Recipe.find();
//     res.json(recipes);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch recipes" });
//   }
// });

// export default router;



import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  getPopularRecipes,
  likeRecipe,
  getRandomRecipe,
  getRelatedRecipes,
} from "../controller/recipeController.js";

const router = express.Router();

// Order matters: specific routes before dynamic ones
router.get("/popular", getPopularRecipes);
router.get("/random", getRandomRecipe);
router.get("/:id/related", getRelatedRecipes);
router.post("/:id/like", likeRecipe);
router.get("/:id", getRecipeById);
router.get("/", getAllRecipes);

export default router;
