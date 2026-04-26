/**
 * Parkware — Booking Service (Firestore)
 * Handles all booking CRUD operations with real-time listeners.
 */
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot, getDocs,
  Timestamp, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

const BOOKINGS_COL = "bookings";
const SLOTS_COL = "parkingSlots";

/**
 * Listen to available (unoccupied) parking slots in real-time.
 */
export const listenToAvailableSlots = (callback) => {
  const q = query(collection(db, SLOTS_COL), orderBy("slotId", "asc"));
  return onSnapshot(q, (snapshot) => {
    const slots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(slots);
  }, (err) => console.error("🔥 Slot listener error:", err));
};

/**
 * Listen to bookings for a specific user in real-time.
 */
export const listenToUserBookings = (userId, callback) => {
  const q = query(
    collection(db, BOOKINGS_COL),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(bookings);
  }, (err) => console.error("🔥 Booking listener error:", err));
};

/**
 * Check if a slot is currently booked (has an active booking).
 */
export const isSlotBooked = async (slotId) => {
  const q = query(
    collection(db, BOOKINGS_COL),
    where("slotId", "==", slotId),
    where("status", "==", "active")
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

/**
 * Create a new booking and mark the slot as occupied.
 * @returns {Object} { success, bookingId, error }
 */
export const createBooking = async ({
  userId, userEmail, userName, slotId, slotDocId,
  vehicleNumber, duration, startTime, endTime, amount
}) => {
  try {
    // 1. Double-check slot availability
    const alreadyBooked = await isSlotBooked(slotId);
    if (alreadyBooked) {
      return { success: false, error: "This slot was just booked by someone else. Please choose another." };
    }

    // 2. Create booking document
    const bookingData = {
      userId,
      userEmail,
      userName: userName || userEmail.split("@")[0],
      slotId,
      slotDocId,
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      duration,        // in minutes
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(endTime)),
      amount,          // in ₹
      status: "active",
      paymentStatus: "pending",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, BOOKINGS_COL), bookingData);

    // 3. Mark parking slot as occupied in Firestore
    if (slotDocId) {
      await updateDoc(doc(db, SLOTS_COL, slotDocId), {
        isOccupied: true,
        vehicle: vehicleNumber.toUpperCase().trim(),
        startTime: Timestamp.fromDate(new Date(startTime)),
      });
    }

    return { success: true, bookingId: docRef.id };
  } catch (err) {
    console.error("🔥 Booking creation failed:", err);
    return { success: false, error: err.message };
  }
};

/**
 * Cancel an active booking and free the slot.
 */
export const cancelBooking = async (bookingId, slotDocId) => {
  try {
    await updateDoc(doc(db, BOOKINGS_COL, bookingId), {
      status: "cancelled",
    });

    if (slotDocId) {
      await updateDoc(doc(db, SLOTS_COL, slotDocId), {
        isOccupied: false,
        vehicle: null,
        startTime: null,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("🔥 Booking cancellation failed:", err);
    return { success: false, error: err.message };
  }
};

/**
 * Complete a booking (on exit).
 */
export const completeBooking = async (bookingId, slotDocId) => {
  try {
    await updateDoc(doc(db, BOOKINGS_COL, bookingId), {
      status: "completed",
    });

    if (slotDocId) {
      await updateDoc(doc(db, SLOTS_COL, slotDocId), {
        isOccupied: false,
        vehicle: null,
        startTime: null,
      });
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Calculate pricing based on duration.
 * Rate: ₹30/hr, minimum ₹20
 */
export const calculatePrice = (durationMinutes) => {
  const rate = 30; // ₹ per hour
  const price = Math.ceil((durationMinutes / 60) * rate);
  return Math.max(price, 20);
};

/**
 * Listen to ALL bookings in real-time (admin use).
 */
export const listenToAllBookings = (callback) => {
  const q = query(collection(db, BOOKINGS_COL), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};
