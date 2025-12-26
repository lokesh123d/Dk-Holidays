const express = require('express');
const router = express.Router();
const {
    submitContactForm,
    getAllContacts,
    subscribeNewsletter,
    getNewsletterSubscribers
} = require('../controllers/contactController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/', submitContactForm);
router.post('/newsletter', subscribeNewsletter);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllContacts);
router.get('/newsletter', verifyToken, isAdmin, getNewsletterSubscribers);

module.exports = router;
