const express = require('express');
const router = express.Router();
const { getAllTours, getTourById, createTour, updateTour, deleteTour } = require('../controllers/tourController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllTours);
router.get('/:id', getTourById);

// Admin routes
router.post('/', verifyToken, isAdmin, createTour);
router.put('/:id', verifyToken, isAdmin, updateTour);
router.delete('/:id', verifyToken, isAdmin, deleteTour);

module.exports = router;
