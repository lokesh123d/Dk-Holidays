const admin = require('firebase-admin');
const { db } = require('./config/firebase');

async function setPaymentProvider() {
    try {
        console.log('Updating payment settings...');
        const settingsRef = db.collection('settings').doc('payment');

        await settingsRef.set({
            provider: 'razorpay',
            enabled: true,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        console.log('✅ Payment provider set to RAZORPAY and ENABLED.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating settings:', error);
        process.exit(1);
    }
}

setPaymentProvider();
