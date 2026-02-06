import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDi3gk1XP3js7MFuW2gzrxwA1zhcet6k9Q",
  authDomain: "chat-app-ca54c.firebaseapp.com",
  projectId: "chat-app-ca54c",
  storageBucket: "chat-app-ca54c.firebasestorage.app",
  messagingSenderId: "585032057304",
  appId: "1:585032057304:web:aef6e88de38278af2bb2ad",
  measurementId: "G-8BNGTSFCT0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getDatabase(app);
export const db = getFirestore(app);




//585032057304