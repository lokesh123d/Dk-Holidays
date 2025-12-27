const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all active offers
router.get('/', async (req, res) => {
    try {
        console.log('📊 Fetching offers from Firestore...');

        const offersSnapshot = await db.collection('offers')
            .where('active', '==', true)
            .get();

        const offers = [];
        offersSnapshot.forEach(doc => {
            offers.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by createdAt in JavaScript (instead of Firestore)
        offers.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA; // Descending order
        });

        console.log(`✅ Found ${offers.length} offers`);
        res.json({ success: true, data: offers });
    } catch (error) {
        console.error('❌ Error fetching offers:', error);
        console.error('Error details:', error.message, error.stack);
        res.status(500).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Add new offer (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { title, description, discount, code, validTill } = req.body;

        const offerData = {
            title,
            description,
            discount: parseInt(discount),
            code: code || '',
            validTill,
            active: true,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('offers').add(offerData);

        res.json({
            success: true,
            message: 'Offer added successfully',
            data: { id: docRef.id, ...offerData }
        });
    } catch (error) {
        console.error('Error adding offer:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete offer (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.collection('offers').doc(req.params.id).delete();
        res.json({ success: true, message: 'Offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting offer:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
