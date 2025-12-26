import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { bookingService } from '../services/apiService';
import '../styles/pages/MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getUserBookings();
            setBookings(response.data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await bookingService.cancelBooking(bookingId);
            alert('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'status-confirmed';
            case 'pending':
                return 'status-pending';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    return (
        <div className="my-bookings-page">
            <Navbar />

            <div className="container">
                <h1 className="page-title">My Bookings</h1>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading bookings...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-car"></i>
                        <h2>No bookings yet</h2>
                        <p>Start booking your dream car today!</p>
                        <a href="/" className="cta-btn">Browse Cars</a>
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {bookings.map(booking => (
                            <div key={booking.id} className="booking-card">
                                <div className="booking-header">
                                    <h3>{booking.carName}</h3>
                                    <span className={`status ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="booking-details">
                                    <div className="detail-item">
                                        <i className="fas fa-calendar"></i>
                                        <span>Pickup: {new Date(booking.pickupDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-calendar-check"></i>
                                        <span>Return: {new Date(booking.returnDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>{booking.pickupLocation}</span>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-dollar-sign"></i>
                                        <span>Total: ${booking.totalPrice}</span>
                                    </div>
                                </div>

                                {booking.status === 'pending' && (
                                    <button
                                        className="cancel-btn"
                                        onClick={() => handleCancelBooking(booking.id)}
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
