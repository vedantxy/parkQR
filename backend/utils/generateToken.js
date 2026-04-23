const jwt = require('jsonwebtoken');

/**
 * @desc    Generate a JWT token for a user
 * @param   {string} id - User ID
 * @returns {string} - JWT Token
 */
const generateToken = (id) => {
  // Use a secret key from environment variables (fallback for demo)
  const secret = process.env.JWT_SECRET || 'your_super_secret_key_123';
  
  return jwt.sign({ id }, secret, {
    expiresIn: '30d', // Token valid for 30 days
  });
};

module.exports = generateToken;
