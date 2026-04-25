const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['OVERSTAY', 'ENTRY', 'EXIT', 'SYSTEM'],
        default: 'OVERSTAY'
    },
    userId: {
        type: String, // Can be 'admin' or a specific ObjectID
        default: 'admin'
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSlot'
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
