import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  cuisine: String, // Indian, Japanese, etc.
  category: String, // Main Course, Dessert, etc.

  time: {
    prep_minutes: { type: Number, default: 0 },
    cook_minutes: { type: Number, default: 0 },
    inactive_minutes: { type: Number, default: 0 },
    total_minutes: { type: Number, default: 0 },
  },

  image: String,

  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],

  procedure: [String],

  dietType: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan'], default: 'Vegetarian' },

  tags: [String], // e.g. ["spicy", "quick", "healthy"]

  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
    },
  ],

  averageRating: { type: Number, default: 0 },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model("Recipe", recipeSchema);
