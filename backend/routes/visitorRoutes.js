const express = require('express');
const router = express.Router();
const { createVisitor, verifyVisitor } = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/visitors
// @desc    Register a new visitor and generate QR
// @access  Public (for dev) or Private
router.post('/', createVisitor);

// @route   POST /api/visitors/verify
// @desc    Verify a visitor QR code
// @access  Private (Guard only)
router.post('/verify', verifyVisitor);


module.exports = router;
