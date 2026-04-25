const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');

// @route   GET /api/analytics
router.get('/', getDashboardStats);

module.exports = router;
