const admin = require('firebase-admin');

let firebaseApp;

try {
    let credential;

    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID) {
        console.log('Using Firebase environment variables for production');

        let privateKey = process.env.FIREBASE_PRIVATE_KEY;

        // Handle different formats:
        // 1. If key has literal \n strings, replace with actual newlines
        if (privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        // 2. Remove quotes if present
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }

        // 3. Remove quotes and process escapes
        privateKey = privateKey.replace(/^["']|["']$/g, '');

        console.log('Private key format check:', {
            hasBeginMarker: privateKey.includes('BEGIN PRIVATE KEY'),
            hasEndMarker: privateKey.includes('END PRIVATE KEY'),
            length: privateKey.length,
            hasNewlines: privateKey.includes('\n')
        });

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
    console.error('Full error:', error);

    if (process.env.FIREBASE_PRIVATE_KEY) {
        console.error('Private key preview (first 100 chars):', process.env.FIREBASE_PRIVATE_KEY.substring(0, 100));
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
