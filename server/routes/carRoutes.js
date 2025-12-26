const express = require('express');
const router = express.Router();
const {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    searchCars
} = require('../controllers/carController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllCars);
router.get('/search', searchCars);
router.get('/:id', getCarById);

// Admin routes
router.post('/', verifyToken, isAdmin, createCar);
router.put('/:id', verifyToken, isAdmin, updateCar);
router.delete('/:id', verifyToken, isAdmin, deleteCar);

module.exports = router;
