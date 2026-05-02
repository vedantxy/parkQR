const Notification = require('../models/Notification');
const ParkingSlot = require('../models/ParkingSlot');
const { isDBConnected, mockStore } = require('../utils/mockData');
const { sendOverstayAlert } = require('../utils/smsService');

/**
 * @desc    Get all notifications (latest first)
 * @route   GET /api/notifications
 */
exports.getNotifications = async (req, res) => {
    try {
        if (isDBConnected()) {
            const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
            return res.status(200).json({ success: true, data: notifications });
        }

        res.status(200).json({ success: true, data: mockStore.notifications, isMock: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/notifications/:id
 */
exports.markAsRead = async (req, res) => {
    try {
        if (isDBConnected()) {
            const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
            return res.status(200).json({ success: true, data: notification });
        }

        const notif = mockStore.notifications.find(n => n._id === req.params.id);
        if (notif) notif.read = true;
        res.status(200).json({ success: true, data: notif, isMock: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Background-safe logic for overstay detection
 */
exports.checkOverstays = async (io) => {
    try {
        if (isDBConnected()) {
            const occupiedSlots = await ParkingSlot.find({ isOccupied: true });
            return await processOverstays(occupiedSlots, io);
        }
        return 0;
    } catch (err) {
        console.error('Error in Overstay Detection:', err);
    }
};

async function processOverstays(occupiedSlots, io) {
    const now = new Date();
    let detectedCount = 0;
    for (const slot of occupiedSlots) {
        if (!slot.startTime) continue;
        const startTime = new Date(slot.startTime);
        const duration = Math.floor((now - startTime) / (1000 * 60));
        slot.duration = duration;
        
        if (duration > slot.timeLimit && !slot.isOverstayed) {
            slot.isOverstayed = true;
            const notif = await Notification.create({
                message: `CRITICAL: Vehicle at Slot ${slot.slotId} has exceeded ${slot.timeLimit} min limit.`,
                type: 'OVERSTAY', slotId: slot._id, userId: 'admin'
            });
            
            // Emit Real-time Events
            if (io) {
                io.emit('visitor-overstayed', { slotId: slot.slotId, duration });
                io.emit('notification-added', notif);
            }
            
            // Send Overstay SMS Alert to Resident
            // Note: Since we don't have direct access to resident phone here,
            // we'll fetch visitor or use fallback (demo purposes).
            // In a real scenario, we would populate slot.visitorId and then get the resident phone.
            await sendOverstayAlert(process.env.TWILIO_PHONE, `Vehicle ${slot.vehicle || slot.slotId}`, duration);
            
            detectedCount++;
        }
        await slot.save();
    }
    return detectedCount;
}
