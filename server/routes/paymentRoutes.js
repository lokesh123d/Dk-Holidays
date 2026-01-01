const express = require('express');
const router = express.Router();
const {
    getPaymentSettings,
    updatePaymentSettings,
    createPaymentIntent
} = require('../controllers/paymentController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes (or authenticated user routes)
router.post('/create-payment-intent', verifyToken, createPaymentIntent);

// Admin routes
router.get('/settings', verifyToken, isAdmin, getPaymentSettings);
router.put('/settings', verifyToken, isAdmin, updatePaymentSettings);

module.exports = router;
