const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
    slotId: {
        type: String,
        required: true,
        unique: true
    },
    isOccupied: {
        type: Boolean,
        default: false
    },
    vehicle: {
        type: String,
        default: null
    },
    startTime: {
        type: Date,
        default: null
    },
    slotType: {
        type: String,
        enum: ['Guest', 'VIP', 'Reserved'],
        default: 'Guest'
    },
    visitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visitor',
        default: null
    },
    duration: {
        type: Number,
        default: 0 // Duration in minutes
    },
    isOverstayed: {
        type: Boolean,
        default: false
    },
    timeLimit: {
        type: Number,
        default: 60 // Configurable limit in minutes
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
