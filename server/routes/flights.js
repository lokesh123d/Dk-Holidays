const express = require('express');
const router = express.Router();
const { searchFlights, getBookingOptions } = require('../controllers/flightController');

// @route   POST /api/flights/search
// @desc    Search flights using Google Flights API
// @access  Public
router.post('/search', searchFlights);

// @route   POST /api/flights/booking-options
// @desc    Get booking options for selected flight
// @access  Public
router.post('/booking-options', getBookingOptions);

module.exports = router;
