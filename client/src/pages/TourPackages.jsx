import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages/TourPackages.css';
import { useAuth } from '../utils/AuthContext';
import BookingModal from '../components/BookingModal';
import TourDetailsModal from '../components/TourDetailsModal';
import { tourService } from '../services/apiService';
import { toast } from 'react-toastify';

const TourPackages = () => {
    const { currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [tourPackages, setTourPackages] = useState([]);
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tour Details Modal
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTourDetails, setSelectedTourDetails] = useState(null);

    // Expanded descriptions state
    const [expandedDescriptions, setExpandedDescriptions] = useState({});

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [selectedDuration, setSelectedDuration] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(true); // Show filters by default

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await tourService.getAllTours();
                if (res.success && res.data) {
                    setTourPackages(res.data);
                    setFilteredPackages(res.data);
                }
            } catch (error) {
                console.error("Failed to load tours", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    // Apply filters whenever filter states change
    useEffect(() => {
        let filtered = [...tourPackages];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(pkg =>
                pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pkg.destinations.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Price filter
        filtered = filtered.filter(pkg => {
            const price = parseInt(pkg.price) || 0;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Duration filter
        if (selectedDuration !== 'all') {
            filtered = filtered.filter(pkg => {
                const duration = pkg.duration || '';
                if (selectedDuration === '5-7') return duration.includes('5D') || duration.includes('6D') || duration.includes('7D');
                if (selectedDuration === '8-10') return duration.includes('8D') || duration.includes('9D') || duration.includes('10D');
                if (selectedDuration === '11+') return duration.includes('11D') || duration.includes('12D');
                return true;
            });
        }

        // Sort
        if (sortBy === 'price-low') {
            filtered.sort((a, b) => parseInt(a.price || 0) - parseInt(b.price || 0));
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => parseInt(b.price || 0) - parseInt(a.price || 0));
        } else if (sortBy === 'duration-short') {
            filtered.sort((a, b) => {
                const daysA = parseInt(a.duration?.match(/\d+/)?.[0] || 0);
                const daysB = parseInt(b.duration?.match(/\d+/)?.[0] || 0);
                return daysA - daysB;
            });
        } else if (sortBy === 'duration-long') {
            filtered.sort((a, b) => {
                const daysA = parseInt(a.duration?.match(/\d+/)?.[0] || 0);
                const daysB = parseInt(b.duration?.match(/\d+/)?.[0] || 0);
                return daysB - daysA;
            });
        }

        setFilteredPackages(filtered);
    }, [searchQuery, priceRange, selectedDuration, sortBy, tourPackages]);

    const handleBooking = (tour) => {
        setSelectedPackage(tour);
        setIsModalOpen(true);
    };

    const getFeaturesArray = (features) => {
        if (Array.isArray(features)) return features;
        if (typeof features === 'string') return features.split(',').map(f => f.trim());
        return [];
    };

    const resetFilters = () => {
        setSearchQuery('');
        setPriceRange([0, 100000]);
        setSelectedDuration('all');
        setSortBy('default');
    };

    const handleViewDetails = (tour) => {
        setSelectedTourDetails(tour);
        setIsDetailsModalOpen(true);
    };

    const toggleDescription = (tourId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [tourId]: !prev[tourId]
        }));
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

            {/* Filters Section */}
            <section className="filters-section">
                <div className="container">
                    <div className="filters-header">
                        <div className="search-bar">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search packages, destinations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            className="filter-toggle-btn"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <i className="fas fa-filter"></i>
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="filters-content">
                            <div className="filter-group">
                                <label>
                                    <i className="fas fa-rupee-sign"></i> Price Range
                                </label>
                                <div className="price-range">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100000"
                                        step="5000"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="100000"
                                        step="5000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    />
                                    <div className="price-values">
                                        <span>₹{priceRange[0].toLocaleString()}</span>
                                        <span>₹{priceRange[1].toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="filter-group">
                                <label>
                                    <i className="fas fa-calendar-alt"></i> Duration
                                </label>
                                <div className="duration-buttons">
                                    <button
                                        className={selectedDuration === 'all' ? 'active' : ''}
                                        onClick={() => setSelectedDuration('all')}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={selectedDuration === '5-7' ? 'active' : ''}
                                        onClick={() => setSelectedDuration('5-7')}
                                    >
                                        5-7 Days
                                    </button>
                                    <button
                                        className={selectedDuration === '8-10' ? 'active' : ''}
                                        onClick={() => setSelectedDuration('8-10')}
                                    >
                                        8-10 Days
                                    </button>
                                    <button
                                        className={selectedDuration === '11+' ? 'active' : ''}
                                        onClick={() => setSelectedDuration('11+')}
                                    >
                                        11+ Days
                                    </button>
                                </div>
                            </div>

                            <div className="filter-group">
                                <label>
                                    <i className="fas fa-sort"></i> Sort By
                                </label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="default">Default</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="duration-short">Duration: Short to Long</option>
                                    <option value="duration-long">Duration: Long to Short</option>
                                </select>
                            </div>

                            <button className="reset-filters-btn" onClick={resetFilters}>
                                <i className="fas fa-redo"></i> Reset Filters
                            </button>
                        </div>
                    )}

                    <div className="results-count">
                        <i className="fas fa-info-circle"></i>
                        Showing {filteredPackages.length} of {tourPackages.length} packages
                    </div>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="packages-section">
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Loading Packages...</div>
                    ) : (
                        <div className="packages-grid">
                            {filteredPackages.length > 0 ? (
                                filteredPackages.map(pkg => (
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

                                            <div>
                                                <p className={`package-description ${expandedDescriptions[pkg.id] ? 'expanded' : 'collapsed'}`}>
                                                    {pkg.description}
                                                </p>
                                                {pkg.description && pkg.description.length > 120 && (
                                                    <button
                                                        className={`read-more-btn ${expandedDescriptions[pkg.id] ? 'expanded' : ''}`}
                                                        onClick={() => toggleDescription(pkg.id)}
                                                    >
                                                        {expandedDescriptions[pkg.id] ? 'Read Less' : 'Read More'}
                                                        <i className="fas fa-chevron-down"></i>
                                                    </button>
                                                )}
                                            </div>

                                            <div className="package-features">
                                                {getFeaturesArray(pkg.features).slice(0, 4).map((feature, index) => (
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
                                                <div className="package-actions">
                                                    <button
                                                        className="view-more-btn"
                                                        onClick={() => handleViewDetails(pkg)}
                                                    >
                                                        <i className="fas fa-info-circle"></i> View More
                                                    </button>
                                                    <button
                                                        className="book-btn"
                                                        onClick={() => handleBooking(pkg)}
                                                    >
                                                        <i className="fas fa-calendar-check"></i> Book Now
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="package-contact">
                                                <i className="fas fa-phone-alt"></i>
                                                <span>Call: <a href="tel:8626877277">86268 77277</a> / <a href="tel:7833043091">7833043091</a></span>
                                            </div>
                                            <div className="package-contact" style={{ marginTop: '8px' }}>
                                                <i className="fas fa-envelope"></i>
                                                <span>Email: <a href="mailto:dkholidays26@gmail.com">dkholidays26@gmail.com</a></span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>
                                    <p>No packages match your filters. Try adjusting your search criteria.</p>
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

            <TourDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                tour={selectedTourDetails}
            />
        </div>
    );
};

export default TourPackages;
