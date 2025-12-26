// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZFOt9Jgpu7oPhm_jfF_jLTrE1NUllrsE",
    authDomain: "dk-holidays.firebaseapp.com",
    databaseURL: "https://dk-holidays-default-rtdb.firebaseio.com",
    projectId: "dk-holidays",
    storageBucket: "dk-holidays.firebasestorage.app",
    messagingSenderId: "934876656956",
    appId: "1:934876656956:web:179ede351a984573af9a39",
    measurementId: "G-Q211DP5ELX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, googleProvider, db, realtimeDb, storage, analytics };
export default app;
