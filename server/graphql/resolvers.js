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
      return await Meal.find();
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

      user.savedMeals = user.savedMeals.filter(
        (id) => id.toString() !== mealId
      );
      await user.save();

      return await user.populate("savedMeals");
    },
  },
};

module.exports = resolvers;
