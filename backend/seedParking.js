const mongoose = require('mongoose');
const ParkingSlot = require('./models/ParkingSlot');
require('dotenv').config();

const slots = [
    { slotId: 'A1', slotType: 'Guest', timeLimit: 60 },
    { slotId: 'A2', slotType: 'Guest', timeLimit: 60 },
    { slotId: 'A3', slotType: 'Guest', timeLimit: 60 },
    { slotId: 'B1', slotType: 'VIP', timeLimit: 120 },
    { slotId: 'B2', slotType: 'VIP', timeLimit: 120 },
    { slotId: 'C1', slotType: 'Reserved', timeLimit: 480 },
    { slotId: 'C2', slotType: 'Reserved', timeLimit: 480 },
];

const seedSlots = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/smart_parking'); // Consistent with backend/config/db.js
        await ParkingSlot.deleteMany();
        await ParkingSlot.insertMany(slots);
        console.log('✅ Parking slots initialized');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedSlots();
