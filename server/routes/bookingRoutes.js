const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    deleteBooking
} = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/', verifyToken, createBooking);
router.get('/user', verifyToken, getUserBookings);
router.get('/:id', verifyToken, getBookingById);
router.put('/:id/cancel', verifyToken, cancelBooking);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllBookings);
router.put('/:id/status', verifyToken, isAdmin, updateBookingStatus);
router.delete('/:id', verifyToken, isAdmin, deleteBooking);

module.exports = router;
