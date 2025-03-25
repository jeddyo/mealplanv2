const mongoose = require('mongoose');
const Meal = require('./models/Meal'); // Make sure this path matches your structure
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedMeals = [
  {
    name: "Grilled Chicken Salad",
    ingredients: ["Chicken breast", "Lettuce", "Tomatoes", "Cucumber", "Olive oil", "Lemon juice"],
    instructions: "Grill the chicken breast, chop the vegetables, and mix everything together. Drizzle with olive oil and lemon juice.",
    category: "Salad",
    imageUrl: "https://www.example.com/grilled-chicken-salad.jpg", 
  },
  {
    name: "Spaghetti Bolognese",
    ingredients: ["Spaghetti", "Ground beef", "Tomato sauce", "Onion", "Garlic", "Olive oil"],
    instructions: "Cook the spaghetti. In a pan, sauté onions and garlic, add ground beef, and mix in the tomato sauce. Serve over spaghetti.",
    category: "Pasta",
    imageUrl: "https://www.example.com/spaghetti-bolognese.jpg",
  },
  {
    name: "Avocado Toast",
    ingredients: ["Bread", "Avocado", "Salt", "Pepper", "Lemon juice"],
    instructions: "Toast the bread, mash the avocado, and spread it on top. Add salt, pepper, and a splash of lemon juice.",
    category: "Breakfast",
    imageUrl: "https://www.example.com/avocado-toast.jpg",
  },
];

// Function to seed the database
const seedDB = async () => {
  try {
    await Meal.deleteMany(); // Clears existing meals
    await Meal.insertMany(seedMeals);
    console.log("Database seeded with meals!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

// Run the seeding function
seedDB();
