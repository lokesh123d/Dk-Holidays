import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const AdminRoute = ({ children }) => {
    const { currentUser, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (!isAdmin) {
        return (
            <div className="access-denied">
                <h1>Access Denied</h1>
                <p>You don't have permission to access this page.</p>
                <a href="/">Go to Home</a>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
