const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using Mongoose.
 * Connection URL: mongodb://127.0.0.1:27017/smart_parking
 */
const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_parking', {
       serverSelectionTimeoutMS: 2000,
       maxPoolSize: 10 // Real-world performance
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Error: ${error.message}`);
    console.warn('⚠️  Backend will continue in Mock Mode without Database persistence.');
  }
};

module.exports = connectDB;
