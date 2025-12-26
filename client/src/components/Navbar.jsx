import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import '../styles/components/Navbar.css';

const Navbar = () => {
    const { currentUser, isAdmin, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="header" id="header">
            <nav className="navbar">
                <div className="container">
                    <div className="nav-wrapper">
                        <Link to="/" className="logo">
                            <span className="logo-text">DK Holidays</span>
                        </Link>

                        <ul className="nav-menu" id="navMenu">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link to="/services" className="nav-link">
                                    Services <i className="fas fa-chevron-down"></i>
                                </Link>
                                <ul className="dropdown-menu">
                                    <li><Link to="/services/flights">✈️ Flight Booking</Link></li>
                                    <li><Link to="/services/trains">🚂 Train Booking</Link></li>
                                    <li><Link to="/services/insurance">🛡️ Insurance</Link></li>
                                    <li><Link to="/">🚗 Car Rental</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a href="#about" className="nav-link">About</a>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact" className="nav-link">Contact</Link>
                            </li>

                            {currentUser && (
                                <li className="nav-item">
                                    <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                                </li>
                            )}

                            {isAdmin && (
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link admin-link">
                                        <i className="fas fa-user-shield"></i> Admin Dashboard
                                    </Link>
                                </li>
                            )}
                        </ul>

                        <div className="user-section">
                            {currentUser ? (
                                <div className="user-profile">
                                    <img
                                        src={currentUser.photoURL || '/default-avatar.png'}
                                        alt="User"
                                        className="user-photo"
                                    />
                                    <span className="user-name">{currentUser.displayName || currentUser.email}</span>
                                    <button className="logout-btn" onClick={handleLogout} title="Logout">
                                        <i className="fas fa-sign-out-alt"></i>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="sign-in-btn">Sign In</Link>
                            )}
                        </div>

                        <button className="mobile-menu-btn" id="mobileMenuBtn">
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
