const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseAdmin');
const { isDBConnected } = require('../utils/mockData');
const User = require('../models/User');

/**
 * Middleware to verify auth tokens and attach user to request.
 * 
 * Supports three token types (tried in order):
 *   1. Mock token ('mock-jwt-token-pro-4455') → Demo/dev mode
 *   2. Firebase ID token (from client signInWithEmailAndPassword) → Production
 *   3. Custom JWT (from backend /api/users/login) → Legacy fallback
 */
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // split by space and filter out empty strings in case of multiple spaces
    const parts = req.headers.authorization.split(' ').filter(Boolean);
    token = parts[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized - No Token' });
  }

  try {
    // 1. Demo Mode Support
    if (token === 'mock-jwt-token-pro-4455') {
       req.user = { id: 'm-admin', role: 'admin', name: 'Mock Admin' };
       return next();
    }

    // 2. Try Firebase ID Token verification first
    try {
      const decodedFirebase = await admin.auth().verifyIdToken(token);
      
      // Check Firestore for user profile (if DB is connected)
      if (isDBConnected()) {
        const dbUser = await User.findOne({ email: decodedFirebase.email });
        if (dbUser) {
          req.user = { id: dbUser._id, role: dbUser.role, name: dbUser.name, email: dbUser.email };
          return next();
        }
      }

      // Fallback: derive role from email or Firebase custom claims
      req.user = {
        id: decodedFirebase.uid,
        email: decodedFirebase.email,
        name: decodedFirebase.name || decodedFirebase.email?.split('@')[0] || 'User',
        role: decodedFirebase.role || (decodedFirebase.email?.includes('admin') ? 'admin' : 'guard'),
      };
      return next();

    } catch (firebaseErr) {
      // Not a valid Firebase token — fall through to legacy JWT check
      if (firebaseErr.code !== 'auth/argument-error' && firebaseErr.code !== 'auth/id-token-expired') {
        // Log unexpected Firebase errors (but don't block — try JWT next)
        console.warn('⚠️ Firebase token check failed:', firebaseErr.code || firebaseErr.message);
      }
    }

    // 3. Legacy: Custom JWT verification (from backend /api/users/login)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    if (isDBConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
    } else {
        req.user = { id: decoded.id, role: decoded.role };
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid' });
  }
};

/**
 * Middleware for Role Based Access Control
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied for role: ${req.user?.role || 'Guest'}` });
    }
    next();
  };
};
