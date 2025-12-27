const { auth } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID token
 */
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify the ID token
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ error: 'Invalid token' });
    }
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check custom claims for admin role
        if (req.user.admin === true) {
            next();
        } else {
            return res.status(403).json({ error: 'Admin access required' });
        }
    } catch (error) {
        console.error('Admin check error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { verifyToken, isAdmin };
