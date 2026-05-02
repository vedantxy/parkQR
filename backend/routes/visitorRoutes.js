const express = require('express');
const router = express.Router();
const { createVisitor, scanQR, getVisitors, getVisitorById } = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/visitors
// @desc    Register a new visitor and generate QR
// @access  Public (for dev) or Private
router.post('/', createVisitor);

// @route   POST /api/visitors/scan-qr
// @desc    Unified Entry/Exit Scan API
// @access  Private (Guard only)
router.post('/scan-qr', scanQR);

// @route   GET /api/visitors
router.get('/', protect, getVisitors);

// @route   GET /api/visitors/:id
router.get('/:id', protect, getVisitorById);


module.exports = router;
