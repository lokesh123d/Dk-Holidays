import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages/Services.css';

const Services = () => {
    const [selectedService, setSelectedService] = useState('all');

    const services = [
        {
            id: 'car-rental',
            icon: 'fa-car',
            title: 'Car Rental Services',
            description: 'Wide range of vehicles including Sedans, SUVs, Tempo Travellers, and Buses for all your travel needs in Dharamshala and nearby areas.',
            features: [
                'Luxury and Economy vehicles',
                '4, 7, 12, 17, 25 seater options',
                'Experienced drivers available',
                'Airport transfers',
                'Outstation trips',
                'Corporate bookings'
            ],
            color: '#ff4d4d'
        },
        {
            id: 'flight-booking',
            icon: 'fa-plane',
            title: 'Flight Booking',
            description: 'Book domestic and international flights at competitive prices with best deals and offers.',
            features: [
                'Domestic & International flights',
                'Best price guarantee',
                'Multiple airline options',
                'Easy cancellation & refund',
                '24/7 booking support',
                'Special corporate rates'
            ],
            color: '#4CAF50'
        },
        {
            id: 'train-booking',
            icon: 'fa-train',
            title: 'Train Booking',
            description: 'Hassle-free train ticket booking service for all major routes across India with confirmed bookings.',
            features: [
                'All classes available',
                'Tatkal booking service',
                'Group booking facilities',
                'PNR status check',
                'Seat availability alerts',
                'E-ticket delivery'
            ],
            color: '#2196F3'
        },
        {
            id: 'insurance',
            icon: 'fa-shield-alt',
            title: 'Insurance Services',
            description: 'Comprehensive insurance solutions for your travel, health, vehicle, and life protection needs.',
            features: [
                'Travel insurance',
                'Health insurance',
                'Vehicle insurance',
                'Life insurance',
                'Quick claim processing',
                'Best premium rates'
            ],
            color: '#9C27B0'
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
                            <i className="fas fa-car"></i> Car Rental
                        </button>
                        <button
                            className={selectedService === 'flight-booking' ? 'active' : ''}
                            onClick={() => setSelectedService('flight-booking')}
                        >
                            <i className="fas fa-plane"></i> Flights
                        </button>
                        <button
                            className={selectedService === 'train-booking' ? 'active' : ''}
                            onClick={() => setSelectedService('train-booking')}
                        >
                            <i className="fas fa-train"></i> Trains
                        </button>
                        <button
                            className={selectedService === 'insurance' ? 'active' : ''}
                            onClick={() => setSelectedService('insurance')}
                        >
                            <i className="fas fa-shield-alt"></i> Insurance
                        </button>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="services-grid-section">
                <div className="container">
                    <div className="services-grid">
                        {filteredServices.map(service => (
                            <div key={service.id} className="service-card">
                                <div
                                    className="service-icon"
                                    style={{ background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}CC 100%)` }}
                                >
                                    <i className={`fas ${service.icon}`}></i>
                                </div>
                                <h2>{service.title}</h2>
                                <p className="service-description">{service.description}</p>
                                <ul className="service-features">
                                    {service.features.map((feature, index) => (
                                        <li key={index}>
                                            <i className="fas fa-check-circle"></i>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className="service-cta">
                                    Learn More
                                    <i className="fas fa-arrow-right"></i>
                                </button>
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
                        <a href="https://wa.me/919178212412" className="btn-whatsapp">
                            <i className="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
