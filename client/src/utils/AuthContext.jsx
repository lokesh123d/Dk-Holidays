import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();
            localStorage.setItem('authToken', token);
            return result.user;
        } catch (error) {
            console.error('Google sign in error:', error);
            throw error;
        }
    };

    // Sign in with email and password
    const signIn = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const token = await result.user.getIdToken();
            localStorage.setItem('authToken', token);
            return result.user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    // Sign up with email and password
    const signUp = async (email, password) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const token = await result.user.getIdToken();
            localStorage.setItem('authToken', token);
            return result.user;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    };

    // Sign out
    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('authToken');
            setIsAdmin(false);
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    // Check admin status
    const checkAdminStatus = async (user) => {
        try {
            const tokenResult = await user.getIdTokenResult();
            setIsAdmin(tokenResult.claims.admin === true);
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Get and store token
                const token = await user.getIdToken();
                localStorage.setItem('authToken', token);

                // Check admin status
                await checkAdminStatus(user);
            } else {
                localStorage.removeItem('authToken');
                setIsAdmin(false);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        isAdmin,
        signInWithGoogle,
        signIn,
        signUp,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
