const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// For production, use service account key file
// For now, we'll use the default credentials

let firebaseApp;

try {
    // Use service account key file for Firebase Admin SDK
    const serviceAccount = require('./serviceAccountKey.json');

    firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}.firebaseio.com`,
        storageBucket: `${serviceAccount.project_id}.appspot.com`
    });

    console.log('Firebase Admin initialized successfully');
    console.log('Project ID:', serviceAccount.project_id);
} catch (error) {
    console.error('Firebase Admin initialization error:', error);
    console.error('Make sure serviceAccountKey.json exists in server/config/ directory');
}

// Get Firestore database instance
const db = admin.firestore();

// Get Realtime Database instance
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
