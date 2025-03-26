const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Meal = require("../models/Meal");

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      const token = context?.req?.headers?.authorization?.split(" ")[1];
      if (!token) throw new Error("Unauthorized");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return await User.findById(decoded.userId).populate("savedMeals");
    },
    meals: async () => {
      return await Meal.find().populate("createdBy", "username email");
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return { token };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return { token };
    },

    createMeal: async (_, { name, ingredients, instructions, category, imageUrl }, context) => {
      const token = context?.req?.headers?.authorization?.split(" ")[1];
      if (!token) throw new Error("Unauthorized");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const meal = new Meal({
        name,
        ingredients,
        instructions,
        category,
        imageUrl,
        createdBy: decoded.userId,
      });

      await meal.save();
      await meal.populate("createdBy", "username email");

      return meal;
    },

    updateMeal: async (_, { mealId, name, ingredients, instructions, category, imageUrl }, context) => {
      const token = context?.req?.headers?.authorization?.split(" ")[1];
      if (!token) throw new Error("Unauthorized");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const meal = await Meal.findById(mealId);
      if (!meal) throw new Error("Meal not found");

      if (meal.createdBy.toString() !== decoded.userId) {
        throw new Error("You do not have permission to edit this meal");
      }

      meal.name = name;
      meal.ingredients = ingredients;
      meal.instructions = instructions;
      meal.category = category;
      meal.imageUrl = imageUrl;

      await meal.save();
      await meal.populate("createdBy", "username email");

      return meal;
    },

    deleteMeal: async (_, { mealId }, context) => {
      const token = context?.req?.headers?.authorization?.split(" ")[1];
      if (!token) throw new Error("Unauthorized");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const meal = await Meal.findById(mealId);
      if (!meal) throw new Error("Meal not found");

      if (meal.createdBy.toString() !== decoded.userId) {
        throw new Error("You do not have permission to delete this meal");
      }

      await Meal.findByIdAndDelete(mealId);
      return true;
    },

    saveMeal: async (_, { mealId }, context) => {
      const token = context?.req?.headers?.authorization?.split(" ")[1];
      if (!token) throw new Error("Unauthorized");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error("User not found");

      if (!user.savedMeals.includes(mealId)) {
        user.savedMeals.push(mealId);
        await user.save();
      }

      return await user.populate("savedMeals");
    },

    removeMeal: async (_, { mealId }, context) => {
      const token = context?.req?.headers?.authorization?.split(" ")[1];
      if (!token) throw new Error("Unauthorized");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error("User not found");

      user.savedMeals = user.savedMeals.filter((id) => id.toString() !== mealId);
      await user.save();

      return await user.populate("savedMeals");
    },
  },
};

module.exports = resolvers;
