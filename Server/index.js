const express = require("express");
const connectDB = require("./config/database"); // Import DB file
const dotenv = require("dotenv");
// Load env
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
