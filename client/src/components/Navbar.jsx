import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import '../styles/components/Navbar.css';

const Navbar = () => {
    const { currentUser, isAdmin, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsServicesOpen(false);
    };

    const toggleServices = () => {
        setIsServicesOpen(!isServicesOpen);
    };

    return (
        <header className="header" id="header">
            <nav className="navbar">
                <div className="container">
                    <div className="nav-wrapper">
                        <Link to="/" className="logo" onClick={closeMobileMenu}>
                            <img src="/images/dk-logo-new.png" alt="DK Holidays" className="logo-image" />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                        >
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                        </button>

                        {/* Navigation Menu */}
                        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                            <li className="nav-item">
                                <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                                    <i className="fas fa-home"></i> Home
                                </Link>
                            </li>

                            <li className={`nav-item dropdown ${isServicesOpen ? 'active' : ''}`}>
                                <button
                                    className="nav-link dropdown-toggle"
                                    onClick={toggleServices}
                                >
                                    <i className="fas fa-concierge-bell"></i> Services
                                    <i className={`fas fa-chevron-${isServicesOpen ? 'up' : 'down'}`}></i>
                                </button>
                                <ul className={`dropdown-menu ${isServicesOpen ? 'show' : ''}`}>
                                    <li>
                                        <Link to="/services/tickets" onClick={closeMobileMenu}>
                                            Ticket Booking
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/services/tours" onClick={closeMobileMenu}>
                                            Tour Packages
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/services/insurance" onClick={closeMobileMenu}>
                                            Insurance
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/" onClick={(e) => {
                                            closeMobileMenu();
                                            setTimeout(() => document.getElementById('vehicle-fleet').scrollIntoView({ behavior: 'smooth' }), 100);
                                        }}>
                                            Car & Bike Rental
                                        </Link>
                                    </li>
                                </ul>
                            </li>


                            <li className="nav-item">
                                <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>
                                    <i className="fas fa-envelope"></i> Contact
                                </Link>
                            </li>

                            {currentUser && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/my-bookings" className="nav-link" onClick={closeMobileMenu}>
                                            <i className="fas fa-calendar-check"></i> My Bookings
                                        </Link>
                                    </li>

                                    <li className="nav-item mobile-only">
                                        <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>
                                            <i className="fas fa-user"></i> My Profile
                                        </Link>
                                    </li>
                                </>
                            )}

                            {isAdmin && (
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link admin-link" onClick={closeMobileMenu}>
                                        <i className="fas fa-user-shield"></i> Admin Dashboard
                                    </Link>
                                </li>
                            )}

                            {/* Mobile-only authentication buttons */}
                            <li className="nav-item mobile-only">
                                {currentUser ? (
                                    <button className="nav-link logout-link" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                ) : (
                                    <Link to="/login" className="nav-link" onClick={closeMobileMenu}>
                                        <i className="fas fa-sign-in-alt"></i> Sign In
                                    </Link>
                                )}
                            </li>
                        </ul>

                        {/* Desktop User Section */}
                        <div className="user-section desktop-only">
                            {currentUser ? (
                                <div className="user-profile">
                                    <Link to="/profile" className="user-info">
                                        <img
                                            src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email)}&background=random&color=fff`}
                                            alt="User"
                                            className="user-photo"
                                        />
                                        <span className="user-name">{currentUser.displayName || currentUser.email}</span>
                                    </Link>
                                    <button className="logout-btn" onClick={handleLogout} title="Logout">
                                        <i className="fas fa-sign-out-alt"></i>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="sign-in-btn">
                                    <i className="fas fa-sign-in-alt"></i> Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile menu */}
                {isMobileMenuOpen && (
                    <div className="mobile-overlay" onClick={closeMobileMenu}></div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
