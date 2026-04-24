const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using Mongoose.
 * Connection URL: mongodb://127.0.0.1:27017/smart_parking
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/smart_parking');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    // Exit process with failure code
    process.exit(1);
  }
};

module.exports = connectDB;
