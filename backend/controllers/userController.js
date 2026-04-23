const User = require('../models/User');

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 3. Create user
    // Note: Password hashing is handled by the pre-save hook in User model
    const user = await User.create({
      name,
      email,
      password, // Passed as plain text, model hashes it
      role
    });

    if (user) {
      // 4. Return user data (WITHOUT password)
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser };
