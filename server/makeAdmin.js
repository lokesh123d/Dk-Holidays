const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://dk-holidays-default-rtdb.firebaseio.com"
});

// Get user UID from command line argument
const uid = process.argv[2];

if (!uid) {
    console.error('❌ Error: Please provide a user UID');
    console.log('Usage: node makeAdmin.js <USER_UID>');
    console.log('\nTo get your UID:');
    console.log('1. Sign in to the application');
    console.log('2. Go to Firebase Console > Authentication');
    console.log('3. Find your user and copy the UID');
    console.log('4. Run: node makeAdmin.js YOUR_UID_HERE');
    process.exit(1);
}

// Set admin custom claim
admin.auth().setCustomUserClaims(uid, { admin: true })
    .then(() => {
        console.log('✅ Admin role set successfully!');
        console.log(`User ${uid} is now an admin.`);
        console.log('\n⚠️  Important: The user must sign out and sign in again for the changes to take effect.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error setting admin role:', error.message);
        process.exit(1);
    });
