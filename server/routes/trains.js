const express = require('express');
const router = express.Router();
const { searchTrains } = require('../controllers/trainController');

// @route   POST /api/trains/search
// @desc    Search trains using RapidAPI
// @access  Public
router.post('/search', searchTrains);

module.exports = router;
