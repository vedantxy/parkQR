const express = require('express');
const router = express.Router();
const { createVisitor } = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/visitors
// @desc    Register a new visitor and generate QR
// @access  Private (Admin, Guard, or Resident)
// router.post('/', protect, authorize('admin', 'guard', 'resident'), createVisitor);
router.post('/', createVisitor);

module.exports = router;
