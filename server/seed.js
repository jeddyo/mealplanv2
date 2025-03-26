// server/seed.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Meal = require("./models/Meal");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedDB = async () => {
  try {
    const user = await User.findOne();
    if (!user) {
      throw new Error("No users found. Please create a user first.");
    }

    const seedMeals = [
      {
        name: "Grilled Chicken Salad",
        ingredients: [
          "Chicken breast",
          "Lettuce",
          "Tomatoes",
          "Cucumber",
          "Olive oil",
          "Lemon juice",
        ],
        instructions:
          "Grill the chicken breast, chop the vegetables, and mix everything together. Drizzle with olive oil and lemon juice.",
        category: "Salad",
        imageUrl:
          "https://www.shutterstock.com/image-vector/chicken-breast-salad-chickenbreast-healthy-260nw-2330607947.jpg",
        createdBy: user._id,
      },
      {
        name: "Spaghetti Bolognese",
        ingredients: [
          "Spaghetti",
          "Ground beef",
          "Tomato sauce",
          "Onion",
          "Garlic",
          "Olive oil",
        ],
        instructions:
          "Cook the spaghetti. In a pan, sauté onions and garlic, add ground beef, and mix in the tomato sauce. Serve over spaghetti.",
        category: "Pasta",
        imageUrl:
          "https://www.shutterstock.com/image-vector/hand-drawn-vector-illustration-spaghetti-260nw-242665321.jpg",
        createdBy: user._id,
      },
      {
        name: "Avocado Toast",
        ingredients: ["Bread", "Avocado", "Salt", "Pepper", "Lemon juice"],
        instructions:
          "Toast the bread, mash the avocado, and spread it on top. Add salt, pepper, and a splash of lemon juice.",
        category: "Breakfast",
        imageUrl:
          "https://www.shutterstock.com/image-vector/avocado-toast-icon-cartoon-vector-260nw-2259848095.jpg",
        createdBy: user._id,
      },
    ];

    await Meal.deleteMany();
    await Meal.insertMany(seedMeals);
    console.log("✅ Database seeded with meals!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    mongoose.connection.close();
  }
};

seedDB();
