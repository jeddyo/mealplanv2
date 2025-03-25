const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Meal = require("../models/Meal");

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

// Get user profile with saved meals
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("savedMeals");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Save a meal
router.post("/saveMeal", authenticate, async (req, res) => {
  const { mealId } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedMeals.includes(mealId)) {
      user.savedMeals.push(mealId);
      await user.save();
    }

    const updatedUser = await User.findById(req.userId).populate("savedMeals");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error saving meal", error });
  }
});

module.exports = router;
