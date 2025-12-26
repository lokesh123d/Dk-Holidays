import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import '../styles/pages/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signInWithGoogle, signIn, signUp, currentUser } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            await signInWithGoogle();
            navigate('/');
        } catch (error) {
            setError('Failed to sign in with Google: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password);
            } else {
                await signIn(email, password);
            }
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Hero Section */}
            <div className="login-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Welcome to DK Holidays</h1>
                    <p>Your trusted partner for car rentals in Dharamshala</p>
                    <div className="hero-features">
                        <div className="feature-item">
                            <img src="https://cdn-icons-png.flaticon.com/128/3448/3448432.png" alt="Cars" />
                            <span>100+ Vehicles</span>
                        </div>
                        <div className="feature-item">
                            <img src="https://cdn-icons-png.flaticon.com/128/3062/3062634.png" alt="Safety" />
                            <span>Safe & Secure</span>
                        </div>
                        <div className="feature-item">
                            <img src="https://cdn-icons-png.flaticon.com/128/2331/2331966.png" alt="Insurance" />
                            <span>Fully Insured</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Form Section */}
            <div className="login-form-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="brand-logo">
                            <h1>DK Holidays</h1>
                        </div>
                        <h2>{isSignUp ? 'Create Your Account' : 'Welcome Back!'}</h2>
                        <p>{isSignUp ? 'Join us and start your journey' : 'Sign in to continue booking'}</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {/* Google Sign In Button - Primary */}
                    <button
                        className="google-btn-primary"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/2991/2991148.png"
                            alt="Google"
                            className="google-icon"
                        />
                        Continue with Google
                    </button>

                    <div className="divider">
                        <span>or {isSignUp ? 'sign up' : 'sign in'} with email</span>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <img src="https://cdn-icons-png.flaticon.com/128/732/732200.png" alt="Email" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <img src="https://cdn-icons-png.flaticon.com/128/3064/3064155.png" alt="Password" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    minLength="6"
                                />
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    <div className="toggle-mode">
                        <p>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button onClick={() => setIsSignUp(!isSignUp)}>
                                {isSignUp ? 'Sign In' : 'Create Account'}
                            </button>
                        </p>
                    </div>

                    <div className="back-home">
                        <a href="/">← Back to Home</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
