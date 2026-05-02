require('dotenv').config();
const mongoose = require('mongoose');
const ParkingSlot = require('./models/ParkingSlot');

const slots = [
  // Guest Slots
  { slotId: 'A01', slotType: 'Guest', isOccupied: false },
  { slotId: 'A02', slotType: 'Guest', isOccupied: false },
  { slotId: 'A03', slotType: 'Guest', isOccupied: false },
  { slotId: 'A04', slotType: 'Guest', isOccupied: false },
  { slotId: 'A05', slotType: 'Guest', isOccupied: false },
  { slotId: 'A06', slotType: 'Guest', isOccupied: false },
  { slotId: 'A07', slotType: 'Guest', isOccupied: false },
  { slotId: 'A08', slotType: 'Guest', isOccupied: false },
  { slotId: 'A09', slotType: 'Guest', isOccupied: false },
  { slotId: 'A10', slotType: 'Guest', isOccupied: false },
  
  // VIP Slots
  { slotId: 'V01', slotType: 'VIP', isOccupied: false },
  { slotId: 'V02', slotType: 'VIP', isOccupied: false },
  { slotId: 'V03', slotType: 'VIP', isOccupied: false },
  
  // Reserved Slots
  { slotId: 'R01', slotType: 'Reserved', isOccupied: false },
  { slotId: 'R02', slotType: 'Reserved', isOccupied: false }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_parking');
    console.log('🌐 Connected to DB for seeding...');
    
    await ParkingSlot.deleteMany({}); // Purana data saaf karein
    await ParkingSlot.insertMany(slots);
    
    console.log('✅ 15 Professional Parking Slots created successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();
