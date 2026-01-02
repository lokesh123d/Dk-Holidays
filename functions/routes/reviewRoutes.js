const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all reviews
router.get('/', async (req, res) => {
    try {
        console.log('📊 Fetching reviews from Firestore...');

        const reviewsSnapshot = await db.collection('reviews').get();

        const reviews = [];
        reviewsSnapshot.forEach(doc => {
            reviews.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by createdAt in JavaScript
        reviews.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });

        console.log(`✅ Found ${reviews.length} reviews`);
        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error('❌ Error fetching reviews:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add new review (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { userName, userEmail, rating, comment, carId } = req.body;

        const reviewData = {
            userName,
            userEmail,
            rating: parseInt(rating),
            comment,
            carId: carId || null,
            approved: true,
            createdAt: new Date().toISOString(),
            date: new Date().toISOString()
        };

        const docRef = await db.collection('reviews').add(reviewData);

        res.json({
            success: true,
            message: 'Review added successfully',
            data: { id: docRef.id, ...reviewData }
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete review (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.collection('reviews').doc(req.params.id).delete();
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
