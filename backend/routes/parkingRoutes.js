const express = require('express');
const router = express.Router();
const { getSlots, assignSmartSlot, releaseSlot, updateSlotStatus } = require('../controllers/parkingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/parking/slots
router.get('/slots', getSlots);

// @route   POST /api/parking/assign
router.post('/assign', protect, assignSmartSlot);

// @route   POST /api/parking/release/:slotId
router.post('/release/:slotId', protect, releaseSlot);

// @route   PATCH /api/parking/status/:slotId
router.patch('/status/:slotId', protect, authorize('admin'), updateSlotStatus);

module.exports = router;
