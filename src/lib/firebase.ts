// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ✅ Import auth
import { getFirestore } from 'firebase/firestore'; // ✅ Add this


const firebaseConfig = {
  apiKey: "AIzaSyCysACcvDeC2j2BjrDWunqhFsIWL3wWfm0",
  authDomain: "netflix-clone-4be70.firebaseapp.com",
  projectId: "netflix-clone-4be70",
  storageBucket: "netflix-clone-4be70.firebasestorage.app",
  messagingSenderId: "48328352059",
  appId: "1:48328352059:web:9774f4e8b64a0c6710571e",
  measurementId: "G-MQVC19S547"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Export Firebase Auth instance
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize db

export { app, auth, analytics, db };
 