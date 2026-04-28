import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore,
  initializeFirestore, 
  persistentLocalCache, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Singleton pattern for Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Singleton pattern for Firestore to handle HMR
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache()
  });
} catch (e) {
  // If already initialized, just get the existing instance
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb;

let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("⚠️ Firebase Analytics could not be initialized:", e.message);
  }
}
export { analytics };

export const subscribeToParkingSlots = (callback) => {
  const q = query(
    collection(db, "parkingSlots"), 
    orderBy("slotId", "asc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const slots = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(slots);
  }, (error) => {
    console.error("🔥 Firestore Subscription Error:", error);
  });
};

export default app;
