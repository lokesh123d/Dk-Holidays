import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages/TourPackages.css';
import { useAuth } from '../utils/AuthContext';
import BookingModal from '../components/BookingModal';
import { tourService } from '../services/apiService';
import { toast } from 'react-toastify';

const TourPackages = () => {
    const { currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [tourPackages, setTourPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await tourService.getAllTours();
                if (res.success && res.data) {
                    setTourPackages(res.data);
                }
            } catch (error) {
                console.error("Failed to load tours", error);
                // Fallback or empty state
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    const handleBooking = (tour) => {
        setSelectedPackage(tour);
        setIsModalOpen(true);
    };

    const getFeaturesArray = (features) => {
        if (Array.isArray(features)) return features;
        if (typeof features === 'string') return features.split(',').map(f => f.trim());
        return [];
    };

    return (
        <div className="tour-packages-page">
            <Navbar />

            {/* Hero Section */}
            <section className="tour-hero">
                <div className="container">
                    <h1>Exclusive Tour Packages</h1>
                    <p>Curated experiences for your perfect holiday in the mountains</p>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="packages-section">
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Loading Packages...</div>
                    ) : (
                        <div className="packages-grid">
                            {tourPackages.length > 0 ? (
                                tourPackages.map(pkg => (
                                    <div key={pkg.id} className="package-card">
                                        <div className="package-image">
                                            <img
                                                src={pkg.image || '/images/hero/hero-2.png'}
                                                alt={pkg.title}
                                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero/hero-2.png' }}
                                            />
                                        </div>
                                        <div className="package-details">
                                            <div className="package-header">
                                                <h3>{pkg.title}</h3>
                                                <span className="package-duration">{pkg.duration}</span>
                                            </div>
                                            <p className="package-description">{pkg.description}</p>

                                            <div className="package-features">
                                                {getFeaturesArray(pkg.features).map((feature, index) => (
                                                    <div key={index} className="feature">
                                                        <i className="fas fa-check-circle"></i>
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="package-footer">
                                                <div className="package-price">
                                                    <span className="price-label">Starting From</span>
                                                    <span className="price-amount">₹{pkg.price}</span>
                                                </div>
                                                <button
                                                    className="book-btn"
                                                    onClick={() => handleBooking(pkg)}
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>
                                    <p>No tour packages available at the moment.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedItem={selectedPackage}
                currentUser={currentUser}
                bookingType="tour"
            />
        </div>
    );
};

export default TourPackages;
