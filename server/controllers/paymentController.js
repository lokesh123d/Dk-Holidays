const { db } = require('../config/firebase');

// Mock Payment libraries to prevent crash if not installed
let stripe;
let Razorpay;

try {
    stripe = require('stripe');
} catch (err) {
    console.warn("Stripe module not found.");
}

try {
    Razorpay = require('razorpay');
} catch (err) {
    console.warn("Razorpay module not found.");
}

const getPaymentSettings = async (req, res) => {
    try {
        const doc = await db.collection('settings').doc('payment').get();
        const data = doc.exists ? doc.data() : { provider: 'stripe', enabled: false };

        let publicKey = '';
        let secretKeySet = false;

        // Get keys from Environment Variables based on provider
        if (data.provider === 'stripe') {
            publicKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
            secretKeySet = !!process.env.STRIPE_SECRET_KEY;
        } else if (data.provider === 'razorpay') {
            publicKey = process.env.RAZORPAY_KEY_ID || '';
            secretKeySet = !!process.env.RAZORPAY_KEY_SECRET;
        }

        return res.json({
            success: true,
            data: {
                provider: data.provider || 'stripe',
                enabled: data.enabled || false,
                publicKey: publicKey, // Frontend might need this for display or init
                secretKeySet: secretKeySet // To show "Connected" status in UI
            }
        });

    } catch (error) {
        console.error('Error fetching payment settings:', error);
        res.status(500).json({ error: 'Failed to fetch payment settings' });
    }
};

const updatePaymentSettings = async (req, res) => {
    try {
        const { provider, enabled } = req.body;

        const updateData = {
            provider,
            enabled, // Only provider and enabled status are stored in DB now
            updatedAt: new Date().toISOString()
        };

        // We no longer save keys to the database for security

        await db.collection('settings').doc('payment').set(updateData, { merge: true });

        res.json({ success: true, message: 'Payment settings updated successfully' });

    } catch (error) {
        console.error('Error updating payment settings:', error);
        res.status(500).json({ error: 'Failed to update payment settings' });
    }
};

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'inr', carId, bookingDetails } = req.body;

        // 1. Get Settings (Provider & Enabled status)
        const doc = await db.collection('settings').doc('payment').get();
        if (!doc.exists || !doc.data().enabled) {
            return res.status(400).json({ error: 'Payment gateway is not enabled' });
        }

        const settings = doc.data();

        if (settings.provider === 'stripe') {
            const secretKey = process.env.STRIPE_SECRET_KEY;
            if (!secretKey) return res.status(500).json({ error: 'Stripe Secret Key not configured in server environment' });

            if (!stripe) return res.status(500).json({ error: 'Stripe module missing' });

            const stripeInstance = stripe(secretKey);
            const paymentIntent = await stripeInstance.paymentIntents.create({
                amount: amount * 100,
                currency: currency.toLowerCase(),
                metadata: {
                    carId,
                    customerName: bookingDetails?.userName
                },
                automatic_payment_methods: { enabled: true },
            });

            res.json({
                success: true,
                clientSecret: paymentIntent.client_secret,
                publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
                provider: 'stripe'
            });

        } else if (settings.provider === 'razorpay') {
            console.log("Attempting Razorpay payment...");
            const keyId = process.env.RAZORPAY_KEY_ID;
            const keySecret = process.env.RAZORPAY_KEY_SECRET;

            console.log(`Razorpay Debug: KeyID=${keyId ? 'Yes' : 'No'}, Secret=${keySecret ? 'Yes' : 'No'}`);

            if (!keyId || !keySecret) {
                console.error("Missing Razorpay keys in env");
                return res.status(500).json({ error: 'Razorpay Keys not configured in server environment' });
            }
            if (!Razorpay) {
                console.error("Razorpay module is not loaded");
                return res.status(500).json({ error: 'Razorpay module missing' });
            }

            try {
                const instance = new Razorpay({
                    key_id: keyId,
                    key_secret: keySecret,
                });

                console.log("Creating Razorpay Order with:", { amount: Math.round(amount * 100), keyId });
                const options = {
                    amount: Math.round(amount * 100), // Amount in paise, rounded to integer
                    currency: currency.toUpperCase(),
                    receipt: `receipt_${Date.now()}`,
                    notes: {
                        carId,
                        customerName: bookingDetails?.userName
                    }
                };

                const order = await instance.orders.create(options);
                console.log("Razorpay Order Created:", order.id);

                res.json({
                    success: true,
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    publicKey: keyId,
                    provider: 'razorpay'
                });
            } catch (rzpError) {
                console.error("Razorpay inner error:", rzpError);
                throw rzpError; // Re-throw to main catch
            }

        } else {
            res.status(400).json({ error: 'Unsupported payment provider' });
        }

    } catch (error) {
        console.error('❌ PAYMENT CONTROLLER ERROR:', JSON.stringify(error, null, 2));

        // Extract inner Razorpay error if present
        const errorDetails = error.error?.description || error.description || error.message || 'Unknown error';

        res.status(500).json({
            error: 'Payment failed due to configuration',
            details: errorDetails
        });
    }
};

module.exports = {
    getPaymentSettings,
    updatePaymentSettings,
    createPaymentIntent
};
