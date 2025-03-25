const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");

// GET all meals
router.get("/", async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meals", error });
  }
});

// GET single meal by ID
router.get("/:id", async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: "Meal not found" });
    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meal", error });
  }
});

// POST a new meal
router.post("/", async (req, res) => {
  try {
    const { name, ingredients, instructions, category, imageUrl } = req.body;
    const newMeal = new Meal({ name, ingredients, instructions, category, imageUrl });
    const savedMeal = await newMeal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(500).json({ message: "Error adding meal", error });
  }
});

// DELETE meal by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMeal = await Meal.findByIdAndDelete(req.params.id);
    if (!deletedMeal) return res.status(404).json({ message: "Meal not found" });
    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meal", error });
  }
});

// UPDATE meal by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMeal) return res.status(404).json({ message: "Meal not found" });
    res.json(updatedMeal);
  } catch (error) {
    res.status(500).json({ message: "Error updating meal", error });
  }
});

module.exports = router;
