const express = require('express');
const router = express.Router();
const {
    verifyUser,
    setAdminRole,
    getAllUsers,
    deleteUser
} = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public route for token verification
router.post('/verify', verifyUser);

// Admin routes
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.post('/admin/set-role', verifyToken, isAdmin, setAdminRole);
router.delete('/users/:uid', verifyToken, isAdmin, deleteUser);

module.exports = router;
