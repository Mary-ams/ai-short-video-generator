// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-short-video-generator-9861b.firebaseapp.com",
  projectId: "ai-short-video-generator-9861b",
  storageBucket: "ai-short-video-generator-9861b.firebasestorage.app",
  messagingSenderId: "725546543688",
  appId: "1:725546543688:web:f61b85a53f92cd6d95467d",
  measurementId: "G-DTV2411B8L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);