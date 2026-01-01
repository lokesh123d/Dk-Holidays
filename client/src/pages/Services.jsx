import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/pages/Services.css';

const Services = () => {
    const [selectedService, setSelectedService] = useState('all');

    const services = [
        {
            id: 'car-rental',
            icon: 'fa-taxi',
            title: 'Car & Bike Rental',
            description: 'Premium fleet of cars and bikes tailored for your comfort. Experience seamless travel across Dharamshala with self-drive or chauffeur options.',
            color: '#E50914' // Racing Red
        },
        {
            id: 'ticket-booking',
            icon: 'fa-ticket-alt',
            title: 'Ticket Booking',
            description: 'One-stop solution for flight and train tickets. We ensure a smooth booking experience with flexible cancellation and best market rates.',
            color: '#28C76F' // Green
        },
        {
            id: 'tour-packages',
            icon: 'fa-map-marked-alt',
            title: 'Tour Packages',
            description: 'Explore curated holiday packages for Shimla, Manali, and Dharamshala. Complete itinerary planning with hotels and sightseeing included.',
            color: '#7367F0' // Purple/Blue
        },
        {
            id: 'insurance',
            icon: 'fa-file-contract',
            title: 'Travel Insurance',
            description: 'Comprehensive protection plans for your journey. Safeguard your health and baggage with our trusted insurance partners.',
            color: '#FF9F43' // Orange
        }
    ];

    const filteredServices = selectedService === 'all'
        ? services
        : services.filter(s => s.id === selectedService);

    return (
        <div className="services-page">
            <Navbar />

            {/* Hero Section */}
            <section className="services-hero">
                <div className="container">
                    <h1 className="services-hero-title">Our Services</h1>
                    <p className="services-hero-subtitle">
                        Complete travel and protection solutions for your journey
                    </p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="services-filter">
                <div className="container">
                    <div className="filter-buttons">
                        <button
                            className={selectedService === 'all' ? 'active' : ''}
                            onClick={() => setSelectedService('all')}
                        >
                            All Services
                        </button>
                        <button
                            className={selectedService === 'car-rental' ? 'active' : ''}
                            onClick={() => setSelectedService('car-rental')}
                        >
                            <i className="fas fa-car-alt"></i> Car & Bike
                        </button>
                        <button
                            className={selectedService === 'ticket-booking' ? 'active' : ''}
                            onClick={() => setSelectedService('ticket-booking')}
                        >
                            <i className="fas fa-ticket-alt"></i> Ticket Booking
                        </button>
                        <button
                            className={selectedService === 'tour-packages' ? 'active' : ''}
                            onClick={() => setSelectedService('tour-packages')}
                        >
                            <i className="fas fa-map-marked-alt"></i> Tours
                        </button>
                        <button
                            className={selectedService === 'insurance' ? 'active' : ''}
                            onClick={() => setSelectedService('insurance')}
                        >
                            <i className="fas fa-user-shield"></i> Insurance
                        </button>
                    </div>
                </div>
            </section>

            {/* Services Grid (Minimalist Layout) */}
            <section className="services-grid-section">
                <div className="container">
                    <div className="services-grid">
                        {filteredServices.map(service => (
                            <div key={service.id} className="service-card">
                                <div
                                    className="service-icon-box"
                                    style={{
                                        color: service.color
                                    }}
                                >
                                    <i className={`fas ${service.icon}`}></i>
                                </div>
                                <h2>{service.title}</h2>
                                <p className="service-description">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-choose">
                <div className="container">
                    <h2 className="section-title">Why Choose DK Holidays?</h2>
                    <div className="why-grid">
                        <div className="why-card">
                            <i className="fas fa-headset"></i>
                            <h3>24/7 Support</h3>
                            <p>Round the clock customer service for all your queries</p>
                        </div>
                        <div className="why-card">
                            <i className="fas fa-tags"></i>
                            <h3>Best Prices</h3>
                            <p>Competitive rates with no hidden charges</p>
                        </div>
                        <div className="why-card">
                            <i className="fas fa-shield-check"></i>
                            <h3>Trusted Service</h3>
                            <p>15+ years of reliable service in Dharamshala</p>
                        </div>
                        <div className="why-card">
                            <i className="fas fa-clock"></i>
                            <h3>Quick Processing</h3>
                            <p>Fast booking and confirmation process</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="services-cta">
                <div className="container">
                    <h2>Ready to Book Your Service?</h2>
                    <p>Contact us today and let us make your journey comfortable and memorable</p>
                    <div className="cta-buttons">
                        <a href="/contact" className="btn-primary">
                            <i className="fas fa-phone"></i> Contact Us
                        </a>
                        <a href="https://wa.me/918626877277" className="btn-whatsapp">
                            <i className="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
