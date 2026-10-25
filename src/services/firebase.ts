import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAGvVMs8K6ggKjaQmzc9lIjCZYvtjodKIE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "daystory-8a10a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "daystory-8a10a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "daystory-8a10a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "505512660740",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:505512660740:web:25aca3a0dec5634ebd8a51",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-M580V5HGW4"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Sign in administrator using standard Firebase Email/Password
 */
export async function signInAdmin(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return userCredential.user;
}

/**
 * Sign out administrator
 */
export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

/**
 * Official Firebase Password Reset
 */
export async function sendAdminPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Retrieve fresh Firebase ID Token for backend API calls
 */
export async function getAdminIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken(forceRefresh);
}

export { onAuthStateChanged };
export type { User };
