import React from 'react';
import '../styles/components/Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Column */}
                    <div className="footer-col brand-col">
                        <div className="footer-logo">
                            <i className="fas fa-bolt"></i>
                            <span>DK HOLIDAYS</span>
                        </div>
                        <p className="footer-desc">
                            The ultimate destination for premium car rentals and high-end travel services. We redefine your travel experience.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h3>QUICK LINKS</h3>
                        <ul className="footer-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/#services">Services</a></li>
                            <li><a href="/#vehicle-fleet">Vehicle Fleet</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div className="footer-col">
                        <h3>FOLLOW US</h3>
                        <ul className="social-links">
                            <li>
                                <a href="https://wa.me/8091780737" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                                    <i className="fab fa-whatsapp"></i> WhatsApp
                                </a>
                            </li>
                            <li>
                                <a href="#" className="social-link instagram">
                                    <i className="fab fa-instagram"></i> Instagram
                                </a>
                            </li>
                            <li>
                                <a href="#" className="social-link facebook">
                                    <i className="fab fa-facebook"></i> Facebook
                                </a>
                            </li>
                            <li>
                                <a href="#" className="social-link youtube">
                                    <i className="fab fa-youtube"></i> YouTube
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact/Workshop */}
                    <div className="footer-col">
                        <h3>OFFICE</h3>
                        <ul className="contact-info">
                            <li>
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Near Norbulingka Institute (Blossom Village Resort), Dharamshala, Himachal Pradesh</span>
                            </li>
                            <li>
                                <i className="fas fa-phone-alt"></i>
                                <span>+91 80917 80737</span>
                            </li>
                            <li>
                                <i className="fas fa-envelope"></i>
                                <span>info@dkholidays.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} DK Holidays. All Rights Reserved. Built for comfort.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
