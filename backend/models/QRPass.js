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
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the model as "QRPass"
module.exports = mongoose.model('QRPass', qrSchema);
