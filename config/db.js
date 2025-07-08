const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Adding connection options to get a more specific error
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`!!! DATABASE CONNECTION ERROR: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;