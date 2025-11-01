import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    cuisine: { type: String }, // e.g. "Indian", "Chinese", "Mexican"
    category: { type: String }, // e.g. "Main Course", "Dessert"

    time: {
      prep_minutes: { type: Number, default: 0 },
      cook_minutes: { type: Number, default: 0 },
      inactive_minutes: { type: Number, default: 0 },
      total_minutes: { type: Number, default: 0 },
    },

    // Updated to reflect Cloudinary URLs or null if not available
    image: { type: String, default: null },

    // Updated to support both structured and simple ingredient lists
    ingredients: [
      {
        type: String, // e.g. "tomato", "rice", "garam masala"
      },
    ],

    // Step-by-step instructions
    procedure: [{ type: String }],

    // Dietary classification
    dietType: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Vegan"],
      default: "Vegetarian",
    },

    // Added calorie information
    calories: { type: Number, default: 0 },

    // Descriptive or functional tags
    tags: [{ type: String }], // e.g. ["spicy", "quick", "healthy"]

    // Social and rating data
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
      },
    ],

    averageRating: { type: Number, default: 0 },

    // Reference to creator
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
