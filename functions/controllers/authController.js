const { auth } = require('../config/firebase');

/**
 * Verify user token
 */
const verifyUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decodedToken = await auth.verifyIdToken(token);
        const user = await auth.getUser(decodedToken.uid);

        res.json({
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                customClaims: user.customClaims || {}
            }
        });
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(403).json({ error: 'Invalid token' });
    }
};

/**
 * Set admin role (Super admin only)
 */
const setAdminRole = async (req, res) => {
    try {
        const { uid, isAdmin } = req.body;

        // Set custom user claims
        await auth.setCustomUserClaims(uid, { admin: isAdmin });

        res.json({
            success: true,
            message: `Admin role ${isAdmin ? 'granted' : 'revoked'} successfully`
        });
    } catch (error) {
        console.error('Error setting admin role:', error);
        res.status(500).json({ error: 'Failed to set admin role' });
    }
};

/**
 * Get all users (Admin only)
 */
const getAllUsers = async (req, res) => {
    try {
        const listUsersResult = await auth.listUsers(1000); // Max 1000 users per request

        const users = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            disabled: user.disabled,
            customClaims: user.customClaims || {},
            metadata: {
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime
            }
        }));

        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

/**
 * Delete user (Admin only)
 */
const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;
        await auth.deleteUser(uid);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = {
    verifyUser,
    setAdminRole,
    getAllUsers,
    deleteUser
};
