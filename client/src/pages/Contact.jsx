import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // API call would go here
            console.log('Form submitted:', formData);
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="contact-page">
            <Navbar />

            {/* Hero Section */}
            <section className="contact-hero">
                <div className="container">
                    <h1>Get in Touch</h1>
                    <p>We're here to help with all your travel needs</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="contact-content">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Information */}
                        <div className="contact-info">
                            <h2>Contact Information</h2>
                            <p>Feel free to reach out to us through any of the following channels</p>

                            <div className="contact-details">
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div className="contact-text">
                                        <h3>Address</h3>
                                        <p>Sidhpur, Near Norblinka Institute<br />(Blossom Village Resort)<br />Khaniara Road, Dharamshala-176215<br />Himachal Pradesh</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <i className="fas fa-phone"></i>
                                    </div>
                                    <div className="contact-text">
                                        <h3>Phone</h3>
                                        <p>+91 86268 77277</p>
                                        <p>Available 24/7</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <div className="contact-text">
                                        <h3>Email</h3>
                                        <p>info@dkholidays.com</p>
                                        <p>support@dkholidays.com</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <div className="contact-text">
                                        <h3>Working Hours</h3>
                                        <p>Monday: 9:00 AM - 11:00 PM</p>
                                        <p>Tue - Sun: Open 24 Hours</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="social-media">
                                <h3>Follow Us</h3>
                                <div className="social-icons">
                                    <a href="#" className="social-link facebook">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" className="social-link instagram">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" className="social-link twitter">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="https://wa.me/918626877277" className="social-link whatsapp">
                                        <i className="fab fa-whatsapp"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            <h2>Send us a Message</h2>

                            {submitted && (
                                <div className="success-message">
                                    <i className="fas fa-check-circle"></i>
                                    <p>Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+91 12345 67890"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Subject *</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        placeholder="Tell us how we can help you..."
                                    ></textarea>
                                </div>

                                <button type="submit" className="submit-btn">
                                    <i className="fas fa-paper-plane"></i>
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="map-section">
                <div className="container">
                    <h2 className="section-title">Find Us Here</h2>
                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3377.8!2d76.3184!3d32.2190!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDEzJzA4LjQiTiA3NsKwMTknMDYuMiJF!5e0!3m2!1sen!2sin!4v1234567890"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="DK Holidays Location"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
