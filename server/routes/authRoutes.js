const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Meal = require("../models/Meal");

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Get saved meals
router.get("/saved-meals", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate("savedMeals");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedMeals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved meals", error: err.message });
  }
});

// Save a meal
router.post("/save-meal", async (req, res) => {
  try {
    const { mealId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user.savedMeals.includes(mealId)) {
      user.savedMeals.push(mealId);
      await user.save();
    }

    const updatedUser = await User.findById(decoded.userId).populate("savedMeals");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error saving meal", error: err.message });
  }
});

// Remove Meal
router.delete("/remove-meal/:mealId", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.savedMeals = user.savedMeals.filter(
        (id) => id.toString() !== req.params.mealId
      );
      await user.save();
  
      const updatedUser = await user.populate("savedMeals");
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Error removing meal", error: err.message });
    }
  });
  

module.exports = router;
