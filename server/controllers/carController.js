const { db, realtimeDb } = require('../config/firebase');

/**
 * Get all cars
 */
const getAllCars = async (req, res) => {
    try {
        // Using Firestore
        const carsSnapshot = await db.collection('cars').get();
        const cars = [];
        carsSnapshot.forEach(doc => {
            cars.push({ id: doc.id, ...doc.data() });
        });

        res.json({ success: true, data: cars });
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
};

/**
 * Get car by ID
 */
const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const carDoc = await db.collection('cars').doc(id).get();

        if (!carDoc.exists) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.json({ success: true, data: { id: carDoc.id, ...carDoc.data() } });
    } catch (error) {
        console.error('Error fetching car:', error);
        res.status(500).json({ error: 'Failed to fetch car' });
    }
};

/**
 * Create new car (Admin only)
 */
const createCar = async (req, res) => {
    try {
        const carData = {
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const carRef = await db.collection('cars').add(carData);

        res.status(201).json({
            success: true,
            message: 'Car created successfully',
            data: { id: carRef.id, ...carData }
        });
    } catch (error) {
        console.error('Error creating car:', error);
        res.status(500).json({ error: 'Failed to create car' });
    }
};

/**
 * Update car (Admin only)
 */
const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        await db.collection('cars').doc(id).update(updateData);

        res.json({
            success: true,
            message: 'Car updated successfully',
            data: { id, ...updateData }
        });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ error: 'Failed to update car' });
    }
};

/**
 * Delete car (Admin only)
 */
const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('cars').doc(id).delete();

        res.json({
            success: true,
            message: 'Car deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ error: 'Failed to delete car' });
    }
};

/**
 * Search and filter cars
 */
const searchCars = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;
        let query = db.collection('cars');

        if (category && category !== 'all') {
            query = query.where('category', '==', category);
        }

        const carsSnapshot = await query.get();
        let cars = [];

        carsSnapshot.forEach(doc => {
            cars.push({ id: doc.id, ...doc.data() });
        });

        // Client-side filtering for price and search
        if (minPrice) {
            cars = cars.filter(car => parseFloat(car.price) >= parseFloat(minPrice));
        }
        if (maxPrice) {
            cars = cars.filter(car => parseFloat(car.price) <= parseFloat(maxPrice));
        }
        if (search) {
            const searchLower = search.toLowerCase();
            cars = cars.filter(car =>
                car.name.toLowerCase().includes(searchLower) ||
                car.category.toLowerCase().includes(searchLower)
            );
        }

        res.json({ success: true, data: cars });
    } catch (error) {
        console.error('Error searching cars:', error);
        res.status(500).json({ error: 'Failed to search cars' });
    }
};

module.exports = {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    searchCars
};
