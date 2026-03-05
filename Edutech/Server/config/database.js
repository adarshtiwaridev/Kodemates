const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

// Force Node.js to use Google DNS to resolve MongoDB SRV records
// This bypasses the ECONNREFUSED issues common in Windows/Node 20+ environments
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

// Ensure we are using the correct variable name from your .env
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      console.error("❌ MONGO_URI is missing from environment variables.");
      process.exit(1);
    }

    mongoose.set("strictQuery", true);

    // Connection options for stability
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    };

    console.log("⏳ Attempting to connect to MongoDB...");
    await mongoose.connect(MONGO_URI, options);

    const { host, name } = mongoose.connection;
    console.log(`✅ MongoDB connected successfully!`);
    console.log(`📡 Host: ${host}`);
    console.log(`📂 Database: ${name}`);

  } catch (error) {
    console.error("❌ MongoDB connection failed!");
    console.error(`Reason: ${error.message}`);
    
    if (error.message.includes("ECONNREFUSED")) {
      console.error("💡 TIP: This is a DNS issue. Verify your IP is whitelisted in Atlas (0.0.0.0/0).");
    }
    
    process.exit(1); 
  }
};

module.exports = connectDB;