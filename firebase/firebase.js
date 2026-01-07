// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi3gk1XP3js7MFuW2gzrxwA1zhcet6k9Q",
  authDomain: "chat-app-ca54c.firebaseapp.com",
  projectId: "chat-app-ca54c",
  storageBucket: "chat-app-ca54c.firebasestorage.app",
  messagingSenderId: "585032057304",
  appId: "1:585032057304:web:aef6e88de38278af2bb2ad",
  measurementId: "G-8BNGTSFCT0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getDatabase(app);




//585032057304