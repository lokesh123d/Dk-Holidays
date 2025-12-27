const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all active offers
router.get('/', async (req, res) => {
    try {
        const offersSnapshot = await db.collection('offers')
            .where('active', '==', true)
            .orderBy('createdAt', 'desc')
            .get();

        const offers = [];
        offersSnapshot.forEach(doc => {
            offers.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({ success: true, data: offers });
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ success: false, message: error.message });
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
