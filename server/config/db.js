// Import Mongoose
const mongoose = require("mongoose");

// Load environment variables from .env
require("dotenv").config();

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected...");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit process with failure
    }
};

// Export the function
module.exports = connectDB;
