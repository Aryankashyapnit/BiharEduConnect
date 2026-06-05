import { initializeApp, getApps } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJoxUDi_ityt7t2mpHJ9veO9WPST_l7WY",
  authDomain: "bihareduconnect.firebaseapp.com",
  projectId: "bihareduconnect",
  storageBucket: "bihareduconnect.firebasestorage.app",
  messagingSenderId: "690018701298",
  appId: "1:690018701298:web:a4c0f9db9f3d9472e3256b",
  measurementId: "G-7WR3XJY13W"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Mute internal logging (such as quota exceeded errors/warnings) in console
setLogLevel("silent");

export { app, db };
