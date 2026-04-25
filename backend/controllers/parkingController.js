const ParkingSlot = require('../models/ParkingSlot');

/**
 * @desc    Get all parking slots
 * @route   GET /api/parking/slots
 */
const getSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find().sort({ slotId: 1 });
    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch slots' });
  }
};

module.exports = { getSlots };
