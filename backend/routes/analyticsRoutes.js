const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');

const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/analytics
router.get('/', protect, getDashboardStats);

// @route   GET /api/analytics/dashboard
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
