const admin = require('firebase-admin');

let firebaseApp;

try {
    let credential;

    if (process.env.FIREBASE_PRIVATE_KEY) {
        console.log('Using Firebase environment variables for production');

        // Handle different private key formats
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;

        // Method 1: If key has \\n, replace with actual newlines
        if (privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        // Method 2: Remove quotes if present
        privateKey = privateKey.replace(/^["']|["']$/g, '');

        credential = admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey
        });
    } else {
        console.log('Using Firebase service account JSON file for development');
        const serviceAccount = require('./serviceAccountKey.json');
        credential = admin.credential.cert(serviceAccount);
    }

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
        console.error('💡 For production: Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY');
        console.error('💡 For development: Make sure serviceAccountKey.json exists in server/config/');
    }

    process.exit(1);
}

const db = admin.firestore();
const realtimeDb = admin.database();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
    admin,
    db,
    realtimeDb,
    auth,
    storage,
    firebaseApp
};
