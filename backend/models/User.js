const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'resident', 'guard'],
      message: '{VALUE} is not a valid role'
    },
    default: 'resident'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Best Practice: Password hashing logic usually goes in a pre-save hook
// For now, we are exporting the schema as a production-ready model.

module.exports = mongoose.model('User', userSchema);
