const express = require('express');
const router = express.Router();
const { getSlots } = require('../controllers/parkingController');

// @route   GET /api/parking/slots
router.get('/slots', getSlots);

module.exports = router;
