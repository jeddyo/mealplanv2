const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dietaryPreferences: { type: [String], default: [] },
  savedMeals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
});

module.exports = mongoose.model("User", UserSchema);
