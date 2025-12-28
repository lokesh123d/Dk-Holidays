import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { toast } from 'react-toastify';
import '../styles/pages/Login.css';

const Login = () => {
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    // UI States
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { signInWithGoogle, signIn, signUp, currentUser } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    // Clear error when switching modes
    useEffect(() => {
        setError('');
    }, [isSignUp]);

    // Form Validation
    const validateForm = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!password) {
            setError('Password is required');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        return true;
    };

    // Handle Google Sign In
    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            await signInWithGoogle();
            toast.success('Successfully signed in with Google!');
            navigate('/');
        } catch (error) {
            const errorMessage = error.message || 'Failed to sign in with Google';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password);
                toast.success('Account created successfully! Welcome to DK Holidays!');
            } else {
                await signIn(email, password);
                toast.success('Welcome back!');
            }
            navigate('/');
        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Please sign in.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Toggle between Sign In and Sign Up
    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setEmail('');
        setPassword('');
    };

    // Handle Forgot Password
    const handleForgotPassword = (e) => {
        e.preventDefault();
        if (!email) {
            toast.info('Please enter your email address first');
            return;
        }
        toast.info('Password reset feature will be available soon!');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    {/* Header */}
                    <div className="login-header">
                        <p className="subtitle">Please enter your details</p>
                        <h1>{isSignUp ? 'Create account' : 'Welcome back'}</h1>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Login/Signup Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                disabled={loading}
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    disabled={loading}
                                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {/* Options Row */}
                        <div className="form-options">

                            {!isSignUp && (
                                <a
                                    href="#forgot"
                                    className="forgot-password"
                                    onClick={handleForgotPassword}
                                >
                                    Forgot password
                                </a>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading-spinner">⏳ Processing...</span>
                            ) : (
                                isSignUp ? 'Create Account' : 'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Google Sign In */}
                    <button
                        className="google-btn"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        type="button"
                    >
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="google-icon"
                        />
                        Sign in with Google
                    </button>

                    {/* Toggle Sign In/Sign Up */}
                    <div className="toggle-mode">
                        <p>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                type="button"
                                onClick={toggleMode}
                                disabled={loading}
                            >
                                {isSignUp ? 'Sign in' : 'Sign up'}
                            </button>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="back-home">
                        <a href="/">← Back to Home</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
