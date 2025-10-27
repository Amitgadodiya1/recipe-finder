import Recipe from "../models/Recipe.js";

// ✅ Get all recipes (with filters + pagination)
export const getAllRecipes = async (req, res) => {
  try {
    const { cuisine, category, search } = req.query;
    const filter = {};

    if (cuisine) filter.cuisine = cuisine;
    if (category) filter.category = category;
    if (search)
      filter.name = { $regex: search, $options: "i" };

    const recipes = await Recipe.find(filter);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};


// ✅ Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

// ✅ Get popular recipes (top liked)
export const getPopularRecipes = async (req, res) => {
  try {
    const popular = await Recipe.find().sort({ likes: -1 }).limit(4);
    res.json(popular);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular recipes" });
  }
};

// ✅ Increment like count
export const likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to like recipe" });
  }
};

// ✅ Get a random recipe
export const getRandomRecipe = async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomRecipe = await Recipe.findOne().skip(randomIndex);
    res.json(randomRecipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch random recipe" });
  }
};

// ✅ Get related recipes (same cuisine)
export const getRelatedRecipes = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const related = await Recipe.find({
      cuisine: recipe.cuisine,
      _id: { $ne: recipe._id },
    }).limit(4);

    res.json(related);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch related recipes" });
  }
};
