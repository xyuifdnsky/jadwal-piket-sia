import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQSG-UzCbMKcHOxI9lDeSfbTg-vYmjQM",
  authDomain: "jadwal-piket-sia.firebaseapp.com",
  projectId: "jadwal-piket-sia",
  storageBucket: "jadwal-piket-sia.appspot.com",
  messagingSenderId: "956289518713",
  appId: "1:956289518713:web:69497e102e60c9d4798a8",
  measurementId: "G-Q5E8SPGQ73",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
