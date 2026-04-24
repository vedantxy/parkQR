const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Protect routes - Verify JWT Token and attach user to request
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in headers (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_123');

      // 3. Get user from the token and attach to req.user (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

/**
 * @desc    Grant access based on specific roles
 * @param   {...string} roles - List of allowed roles (e.g., 'admin', 'guard')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user ? req.user.role : 'none'}) is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
