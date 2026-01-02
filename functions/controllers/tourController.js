const { db } = require('../config/firebase');

/**
 * Get all tours
 */
const getAllTours = async (req, res) => {
    try {
        const toursSnapshot = await db.collection('tours').get();
        const tours = [];
        toursSnapshot.forEach(doc => {
            tours.push({ id: doc.id, ...doc.data() });
        });

        res.json({ success: true, data: tours });
    } catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).json({ error: 'Failed to fetch tours' });
    }
};

/**
 * Get tour by ID
 */
const getTourById = async (req, res) => {
    try {
        const { id } = req.params;
        const tourDoc = await db.collection('tours').doc(id).get();

        if (!tourDoc.exists) {
            return res.status(404).json({ error: 'Tour not found' });
        }

        res.json({ success: true, data: { id: tourDoc.id, ...tourDoc.data() } });
    } catch (error) {
        console.error('Error fetching tour:', error);
        res.status(500).json({ error: 'Failed to fetch tour' });
    }
};

/**
 * Create new tour (Admin only)
 */
const createTour = async (req, res) => {
    try {
        const tourData = {
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const tourRef = await db.collection('tours').add(tourData);

        res.status(201).json({
            success: true,
            message: 'Tour package created successfully',
            data: { id: tourRef.id, ...tourData }
        });
    } catch (error) {
        console.error('Error creating tour:', error);
        res.status(500).json({ error: 'Failed to create tour package' });
    }
};

/**
 * Update tour (Admin only)
 */
const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        await db.collection('tours').doc(id).update(updateData);

        res.json({
            success: true,
            message: 'Tour package updated successfully',
            data: { id, ...updateData }
        });
    } catch (error) {
        console.error('Error updating tour:', error);
        res.status(500).json({ error: 'Failed to update tour package' });
    }
};

/**
 * Delete tour (Admin only)
 */
const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('tours').doc(id).delete();

        res.json({
            success: true,
            message: 'Tour package deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting tour:', error);
        res.status(500).json({ error: 'Failed to delete tour package' });
    }
};

module.exports = {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour
};
