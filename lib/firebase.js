import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQSG-UzCbMKcHOxl9lDeSfbTg-vYmjoQM",
  authDomain: "jadwal-piket-sia.firebaseapp.com",
  projectId: "jadwal-piket-sia",
  storageBucket: "jadwal-piket-sia.appspot.com",
  messagingSenderId: "956289518713",
  appId: "1:956289518713:web:69497e102e60c9d4798a8",
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

