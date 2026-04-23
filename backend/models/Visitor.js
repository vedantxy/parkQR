const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    vehicle: {
        type: String,
        required: true
    },
    flatNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['coming', 'inside', 'exited'],
        default: 'coming'
    },
    isPriority: {
        type: Boolean,
        default: false
    },
    entryTime: {
        type: Date
    },
    exitTime: {
        type: Date
    },
    gate: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Visitor', visitorSchema);
