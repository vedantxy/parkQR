const mongoose = require('mongoose');

// QR Pass Schema Definition
const qrSchema = new mongoose.Schema({
    visitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visitor', // Establishing relationship with Visitor model
        required: true
    },
    qrCode: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for fast token lookups
qrSchema.index({ token: 1 });

module.exports = mongoose.model('QRPass', qrSchema);
