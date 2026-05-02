import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import API_URL from '../apiConfig';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('parksmart_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // If user exists in cache, we don't need to show the initial loader
  const [initialLoading, setInitialLoading] = useState(() => {
    return !localStorage.getItem('parksmart_user');
  });
  const [authActionLoading, setAuthActionLoading] = useState(false);

  /**
   * Robust session clear
   */
  const clearSession = useCallback(() => {
    localStorage.removeItem('parksmart_token');
    localStorage.removeItem('parksmart_user');
    localStorage.removeItem('parkora_active_tab');
    setUser(null);
  }, []);

  // Sync Firebase Auth State
  useEffect(() => {
    // Safety timeout: stop loading if Firebase takes too long (reduced to 1s)
    const timeoutId = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 1. INSTANT NAVIGATION: Use cached user data if available to clear loader immediately
        const cachedUserStr = localStorage.getItem('parksmart_user');
        if (cachedUserStr) {
          try {
            const cachedUser = JSON.parse(cachedUserStr);
            if (cachedUser.uid === firebaseUser.uid) {
              setUser(cachedUser);
              setInitialLoading(false); // STOP LOADING NOW
              clearTimeout(timeoutId);
            }
          } catch (e) {}
        }

        // 2. BACKGROUND SYNC: Update profile without blocking UI
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const profilePromise = getDoc(docRef);
          
          // Shorter timeout for background sync, but doesn't block UI anymore
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('timeout')), 2000)
          );

          let docSnap;
          try {
            docSnap = await Promise.race([profilePromise, timeoutPromise]);
          } catch (e) {
            docSnap = { exists: () => false };
          }

          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            token: await firebaseUser.getIdToken(),
            role: docSnap.exists() ? docSnap.data().role : (firebaseUser.email.includes('admin') ? 'admin' : 'guard'),
            name: docSnap.exists() ? docSnap.data().name : (firebaseUser.displayName || firebaseUser.email.split('@')[0]),
          };
          
          localStorage.setItem('parksmart_user', JSON.stringify(userData));
          setUser(userData);
        } catch (err) {
          // Fallback handled silently
        }
      } else {
        if (!localStorage.getItem('parksmart_token')) {
          clearSession();
        }
      }
      
      setInitialLoading(false);
      clearTimeout(timeoutId);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [clearSession]);

  const login = async (email, password, keepLoggedIn = true) => {
    setAuthActionLoading(true);
    try {
      await setPersistence(auth, keepLoggedIn ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // Early token cache
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('parksmart_token', token);
      
      return { success: true };
    } catch (err) {
      const errorMessages = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Account temporarily locked. Try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.',
      };
      return { success: false, message: errorMessages[err.code] || 'Login failed.' };
    } finally {
      setAuthActionLoading(false);
    }
  };

  const requestOtp = async (phone) => {
    setAuthActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      return { success: data.success, message: data.message };
    } catch (err) {
      return { success: false, message: 'Server unreachable.' };
    } finally {
      setAuthActionLoading(false);
    }
  };

  const loginWithOtp = async (phone, otp) => {
    setAuthActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('parksmart_token', data.token);
        localStorage.setItem('parksmart_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'OTP verification failed.' };
    } finally {
      setAuthActionLoading(false);
    }
  };

  const logout = async () => {
    setAuthActionLoading(true);
    try {
      await signOut(auth);
    } finally {
      clearSession();
      setAuthActionLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      requestOtp, 
      loginWithOtp, 
      logout, 
      loading: initialLoading,
      actionLoading: authActionLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
