const ParkingSlot = require('../models/ParkingSlot');
const { isDBConnected, mockStore } = require('../utils/mockData');
const { syncSlotToFirestore } = require('../utils/firebaseSync');

/**
 * @desc    Get all parking slots
 * @route   GET /api/parking/slots
 */
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

/**
 * @desc    Smart Assign a slot using AI/Scoring logic
 * @route   POST /api/parking/assign
 */
const assignSmartSlot = async (req, res) => {
    try {
        const { userType, vehicleNumber } = req.body;
        
        if (!isDBConnected()) {
            return res.status(503).json({ success: false, message: 'DB Disconnected. Run in mock mode.' });
        }

        const slots = await ParkingSlot.find({ isOccupied: false });
        if (!slots.length) {
            return res.status(404).json({ success: false, message: 'No available slots' });
        }

        const scoredSlots = slots.map(slot => {
            let score = 0;

            // Simple distance heuristic based on Slot ID number (e.g., A01 -> 1)
            const numberPart = parseInt(slot.slotId.replace(/\D/g, '')) || 10;
            score += numberPart; // Lower number = closer = better score

            // VIP Priority
            if (userType === 'VIP' && (slot.slotType === 'VIP' || slot.slotId.startsWith('V'))) {
                score -= 50; 
            } else if (userType === 'VIP' && slot.slotType === 'Guest') {
                score -= 10; // VIPs can use Guest if closer, but prefer VIP
            }

            // Reserved Logic
            if (slot.slotType === 'Reserved') {
                score += 100; // Deprioritize reserved unless specifically requested
            }

            // Pseudo-congestion logic (could be based on adjacent slots in future)
            // Just a placeholder to show extensible logic
            const zoneLoad = Math.random() * 5; 
            if (zoneLoad < 2) {
                score -= 2;
            }

            return { ...slot._doc, score };
        });

        // Sort ascending by score
        scoredSlots.sort((a, b) => a.score - b.score);
        const bestSlotData = scoredSlots[0];

        // Update DB
        const bestSlot = await ParkingSlot.findById(bestSlotData._id);
        bestSlot.isOccupied = true;
        bestSlot.vehicle = vehicleNumber || 'Unknown';
        bestSlot.startTime = new Date();
        await bestSlot.save();

        // Sync to Firebase
        await syncSlotToFirestore(bestSlot);

        return res.status(200).json({
            success: true,
            message: 'Smart Slot Allocated',
            data: bestSlot
        });

    } catch (err) {
        console.error('Smart Assign Error:', err);
        return res.status(500).json({ success: false, message: 'Server error during allocation' });
    }
};

/**
 * @desc    Manual release of a parking slot
 * @route   POST /api/parking/release/:slotId
 */
const releaseSlot = async (req, res) => {
    try {
        const { slotId } = req.params;
        
        if (isDBConnected()) {
            const slot = await ParkingSlot.findOne({ slotId });
            if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
            
            slot.isOccupied = false;
            slot.vehicle = null;
            slot.startTime = null;
            slot.visitorId = null;
            await slot.save();
            
            await syncSlotToFirestore(slot);
            
            // Emit Socket event for real-time UI updates
            const io = req.app.get('socketio');
            if (io) io.emit('slot-update', slot);

            return res.status(200).json({ success: true, message: `Slot ${slotId} released`, data: slot });
        }

        // Mock fallback
        const mockSlot = mockStore.slots.find(s => s.slotId === slotId);
        if (mockSlot) {
            mockSlot.isOccupied = false;
            return res.status(200).json({ success: true, message: `Mock Slot ${slotId} released` });
        }
        
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to release slot' });
    }
};

/**
 * @desc    Emergency status override (Admin only)
 * @route   PATCH /api/parking/status/:slotId
 */
const updateSlotStatus = async (req, res) => {
    try {
        const { slotId } = req.params;
        const { isOccupied, slotType, vehicle } = req.body;

        if (isDBConnected()) {
            const slot = await ParkingSlot.findOneAndUpdate(
                { slotId },
                { isOccupied, slotType, vehicle, startTime: isOccupied ? new Date() : null },
                { new: true }
            );
            
            if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
            
            await syncSlotToFirestore(slot);
            
            const io = req.app.get('socketio');
            if (io) io.emit('slot-update', slot);

            return res.status(200).json({ success: true, message: 'Override applied', data: slot });
        }
        
        return res.status(503).json({ success: false, message: 'DB required for override' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Override failed' });
    }
};

module.exports = { getSlots, assignSmartSlot, releaseSlot, updateSlotStatus };
