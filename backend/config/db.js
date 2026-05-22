const mongoose = require('mongoose');

/**
 * Establishes connection to the MongoDB Atlas cluster or local instance.
 * Reads connection URI dynamically from the MONGO_URI environment variable.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit server process on database connection failure
    process.exit(1);
  }
};

module.exports = connectDB;
