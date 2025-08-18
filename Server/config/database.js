// database.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URL (from .env file)
const MONGO_URI = process.env.MONGO_URI;

// Function to connect MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI
  );
    console.log("✅ MongoDB connected successfully...");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Stop the app if DB fails
  }
};

module.exports = connectDB;
