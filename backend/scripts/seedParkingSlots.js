/**
 * Seed Firestore with parking slots.
 * Run: node scripts/seedParkingSlots.js
 */
const admin = require('../config/firebaseAdmin');
const db = admin.firestore();

const SLOTS = [];
const zones = ['A', 'B', 'C', 'D'];
const types = ['Guest', 'Guest', 'Guest', 'VIP', 'Guest', 'Reserved'];

zones.forEach(zone => {
  for (let i = 1; i <= 8; i++) {
    SLOTS.push({
      slotId: `${zone}${i}`,
      isOccupied: Math.random() < 0.25, // 25% occupied
      vehicle: null,
      startTime: null,
      slotType: types[Math.floor(Math.random() * types.length)],
      duration: 0,
      isOverstayed: false,
      timeLimit: 60,
    });
  }
});

async function seed() {
  const col = db.collection('parkingSlots');
  
  // Clear existing
  const existing = await col.get();
  const batch1 = db.batch();
  existing.docs.forEach(doc => batch1.delete(doc.ref));
  await batch1.commit();
  console.log(`🗑️ Cleared ${existing.size} existing slots`);

  // Seed new
  const batch2 = db.batch();
  SLOTS.forEach(slot => {
    const ref = col.doc(slot.slotId);
    batch2.set(ref, slot);
  });
  await batch2.commit();
  console.log(`✅ Seeded ${SLOTS.length} parking slots (Zones A-D, 8 each)`);
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
