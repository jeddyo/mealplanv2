const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

// Initialize App
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Meal Planner API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
