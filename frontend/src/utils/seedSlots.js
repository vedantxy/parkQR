/**
 * Seed Firestore parking slots from the browser console.
 * Import and call: seedParkingSlots()
 */
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const ZONES = ['A', 'B', 'C', 'D'];
const TYPES = ['Guest', 'Guest', 'Guest', 'VIP', 'Guest', 'Reserved'];

export const seedParkingSlots = async () => {
  const col = collection(db, "parkingSlots");

  // Clear existing
  const existing = await getDocs(col);
  for (const d of existing.docs) {
    await deleteDoc(d.ref);
  }
  console.log(`🗑️ Cleared ${existing.size} existing slots`);

  // Seed 32 slots (4 zones × 8 slots)
  let count = 0;
  for (const zone of ZONES) {
    for (let i = 1; i <= 8; i++) {
      const slotId = `${zone}${i}`;
      await setDoc(doc(db, "parkingSlots", slotId), {
        slotId,
        isOccupied: Math.random() < 0.2,
        vehicle: null,
        startTime: null,
        slotType: TYPES[Math.floor(Math.random() * TYPES.length)],
        duration: 0,
        isOverstayed: false,
        timeLimit: 60,
      });
      count++;
    }
  }

  console.log(`✅ Seeded ${count} parking slots`);
  return count;
};
