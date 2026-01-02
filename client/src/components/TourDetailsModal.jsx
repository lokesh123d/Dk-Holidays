import React from 'react';
import '../styles/components/TourDetailsModal.css';

const TourDetailsModal = ({ isOpen, onClose, tour }) => {
    if (!isOpen || !tour) return null;

    const getDaysArray = (itinerary) => {
        if (Array.isArray(itinerary)) return itinerary;
        if (typeof itinerary === 'string') {
            return itinerary.split('\n').filter(day => day.trim());
        }
        return [];
    };

    const getListArray = (items) => {
        if (Array.isArray(items)) return items;
        if (typeof items === 'string') {
            return items.split(',').map(item => item.trim()).filter(item => item);
        }
        return [];
    };

    return (
        <div className="tour-modal-overlay" onClick={onClose}>
            <div className="tour-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="tour-modal-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>

                {/* Header with Image */}
                <div className="tour-modal-header">
                    <img
                        src={tour.image || '/images/hero/hero-2.png'}
                        alt={tour.title}
                        onError={(e) => { e.target.src = '/images/hero/hero-2.png' }}
                    />
                    <div className="tour-modal-header-content">
                        <h2>{tour.title}</h2>
                        <div className="tour-modal-meta">
                            <span><i className="fas fa-calendar-alt"></i> {tour.duration}</span>
                            <span><i className="fas fa-map-marker-alt"></i> {tour.destinations}</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="tour-modal-body">
                    {/* Overview */}
                    <section className="tour-section">
                        <h3><i className="fas fa-info-circle"></i> Overview</h3>
                        <p>{tour.description}</p>
                    </section>

                    {/* Itinerary */}
                    {tour.itinerary && (
                        <section className="tour-section">
                            <h3><i className="fas fa-route"></i> Detailed Itinerary</h3>
                            <div className="itinerary-timeline">
                                {getDaysArray(tour.itinerary).map((day, index) => (
                                    <div key={index} className="itinerary-day">
                                        <div className="day-number">Day {index + 1}</div>
                                        <div className="day-content">{day}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Inclusions */}
                    {tour.inclusions && (
                        <section className="tour-section">
                            <h3><i className="fas fa-check-circle"></i> Inclusions</h3>
                            <ul className="inclusion-list">
                                {getListArray(tour.inclusions).map((item, index) => (
                                    <li key={index}>
                                        <i className="fas fa-check"></i> {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Exclusions */}
                    {tour.exclusions && (
                        <section className="tour-section">
                            <h3><i className="fas fa-times-circle"></i> Exclusions</h3>
                            <ul className="exclusion-list">
                                {getListArray(tour.exclusions).map((item, index) => (
                                    <li key={index}>
                                        <i className="fas fa-times"></i> {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Terms & Conditions */}
                    {tour.terms && (
                        <section className="tour-section">
                            <h3><i className="fas fa-file-contract"></i> Terms & Conditions</h3>
                            <div className="terms-content">
                                {typeof tour.terms === 'string' ? (
                                    <p>{tour.terms}</p>
                                ) : (
                                    getListArray(tour.terms).map((term, index) => (
                                        <p key={index}>{term}</p>
                                    ))
                                )}
                            </div>
                        </section>
                    )}
                </div>

                {/* Footer with Booking */}
                <div className="tour-modal-footer">
                    <div className="tour-price-info">
                        <span className="price-label">Starting From</span>
                        <span className="price-amount">₹{tour.price}</span>
                        <span className="price-note">per person</span>
                    </div>
                    <div className="tour-contact-info">
                        <a href="tel:8626877277" className="contact-btn primary">
                            <i className="fas fa-phone-alt"></i> 86268 77277
                        </a>
                        <a href="tel:7833043091" className="contact-btn primary">
                            <i className="fas fa-phone-alt"></i> 7833043091
                        </a>
                        <a href={`https://wa.me/918626877277?text=Hi, I'm interested in ${tour.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-btn whatsapp">
                            <i className="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href="mailto:dkholidays26@gmail.com?subject=Tour Inquiry"
                            className="contact-btn email">
                            <i className="fas fa-envelope"></i> Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetailsModal;
