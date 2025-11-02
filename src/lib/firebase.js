// This file initializes Firebase and exports the services
import { initializeApp } from "firebase/app";
// Import all auth functions we'll need
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  GoogleAuthProvider,     // <-- ADDED
  signInWithPopup,        // <-- ADDED
  createUserWithEmailAndPassword, // <-- ADDED
  signInWithEmailAndPassword, // <-- ADDED
  signOut,                // <-- ADDED
} from "firebase/auth";
import { getFirestore, setLogLevel } from "firebase/firestore";

// Read local .env variables using Vite's `import.meta.env`
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG_JSON || "{}");

// Set log level for debugging
setLogLevel("debug");

// Initialize app and export services
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export all auth functions to be used in the app
export {
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};

