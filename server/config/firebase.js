const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Supports both JSON file (local) and environment variables (production)

let firebaseApp;

try {
    let credential;

    // Check if we're in production (Render/Vercel) or development (local)
    if (process.env.FIREBASE_PRIVATE_KEY) {
        // Production: Use environment variables
        console.log('Using Firebase environment variables for production');

        credential = admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Replace escaped newlines with actual newlines
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        });
    } else {
        // Development: Use JSON file
        console.log('Using Firebase service account JSON file for development');
        const serviceAccount = require('./serviceAccountKey.json');
        credential = admin.credential.cert(serviceAccount);
    }

    // Initialize Firebase Admin
    firebaseApp = admin.initializeApp({
        credential: credential,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
    });

    console.log('✅ Firebase Admin initialized successfully');
    console.log('📦 Project ID:', process.env.FIREBASE_PROJECT_ID || 'from JSON file');
} catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);

    if (!process.env.FIREBASE_PRIVATE_KEY) {
        console.error('💡 For production: Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables');
        console.error('💡 For development: Make sure serviceAccountKey.json exists in server/config/ directory');
    }

    // Exit if Firebase fails to initialize
    process.exit(1);
}

// Get Firestore database instance
const db = admin.firestore();

// Get Realtime Database instance (if needed)
const realtimeDb = admin.database();

// Get Firebase Auth instance
const auth = admin.auth();

// Get Firebase Storage instance
const storage = admin.storage();

module.exports = {
    admin,
    db,
    realtimeDb,
    auth,
    storage,
    firebaseApp
};
