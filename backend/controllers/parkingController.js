const ParkingSlot = require('../models/ParkingSlot');

/**
 * @desc    Get all parking slots
 * @route   GET /api/parking/slots
 */
const { isDBConnected, mockStore } = require('../utils/mockData');

const getSlots = async (req, res) => {
  try {
    if (isDBConnected()) {
      const slots = await ParkingSlot.find().sort({ slotId: 1 });
      return res.status(200).json({ success: true, count: slots.length, data: slots });
    }

    res.status(200).json({
      success: true,
      count: mockStore.slots.length,
      data: mockStore.slots,
      isMock: true
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch slots' });
  }
};

module.exports = { getSlots };
