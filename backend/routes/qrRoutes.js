const express = require('express');
const router = express.Router();
const { generateVisitorQR } = require('../controllers/qrController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/qr/generate/:visitorId
// @desc    Generate QR Code for a visitor
// @access  Private (Admin or Guard can generate)
router.post('/generate/:visitorId', protect, authorize('admin', 'guard'), generateVisitorQR);

module.exports = router;
