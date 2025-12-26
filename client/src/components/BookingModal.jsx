import React, { useState } from 'react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, bookingData, type }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        passengers: bookingData?.passengers || 1,
        date: bookingData?.date || '',
        from: bookingData?.from || '',
        to: bookingData?.to || '',
        flightNumber: bookingData?.flightNumber || '',
        trainNumber: bookingData?.trainNumber || '',
        price: bookingData?.price || 0,
        totalPrice: (bookingData?.price || 0) * (bookingData?.passengers || 1)
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // WhatsApp Message
        const whatsappNumber = '917037447309'; // Add country code
        const message = `
*New ${type} Booking Request*

*Customer Details:*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

*Journey Details:*
From: ${formData.from}
To: ${formData.to}
Date: ${formData.date}
${type === 'Flight' ? `Flight: ${formData.flightNumber}` : `Train: ${formData.trainNumber}`}
Passengers: ${formData.passengers}

*Payment:*
Total Amount: ₹${formData.totalPrice}

Please confirm this booking!
        `.trim();

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        // Send Email using EmailJS
        try {
            // You need to set up EmailJS account and get these IDs
            const emailData = {
                to_email: 'lokesh25@navgurukul.org',
                subject: `New ${type} Booking - ${formData.name}`,
                message: message,
                from_name: formData.name,
                from_email: formData.email,
                reply_to: formData.email
            };

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Send Email (you'll need to integrate EmailJS or similar service)
            await sendEmail(emailData);

            alert('Booking request sent successfully! Our team will contact you soon.');
            onClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Booking request sent to WhatsApp. Email sending failed. Please try again.');
        }
    };

    const sendEmail = async (data) => {
        // EmailJS integration
        // For now, using mailto as fallback
        const mailtoLink = `mailto:lokesh25@navgurukul.org?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message)}`;
        window.location.href = mailtoLink;
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                <h2>Complete Your Booking</h2>
                <p className="modal-subtitle">{type === 'Flight' ? '✈️' : '🚂'} {bookingData?.name}</p>

                <form onSubmit={handleSubmit} className="booking-form">
                    {/* Personal Details */}
                    <div className="form-section">
                        <h3>Personal Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>
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
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="Enter your phone number"
                                pattern="[0-9]{10}"
                            />
                        </div>
                    </div>

                    {/* Journey Details */}
                    <div className="form-section">
                        <h3>Journey Details</h3>
                        <div className="journey-summary">
                            <div className="journey-item">
                                <span>From:</span>
                                <strong>{formData.from}</strong>
                            </div>
                            <div className="journey-item">
                                <span>To:</span>
                                <strong>{formData.to}</strong>
                            </div>
                            <div className="journey-item">
                                <span>Date:</span>
                                <strong>{formData.date}</strong>
                            </div>
                            <div className="journey-item">
                                <span>Passengers:</span>
                                <strong>{formData.passengers}</strong>
                            </div>
                            <div className="journey-item">
                                <span>{type}:</span>
                                <strong>{type === 'Flight' ? formData.flightNumber : formData.trainNumber}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="form-section price-section">
                        <h3>Price Summary</h3>
                        <div className="price-details">
                            <div className="price-row">
                                <span>Base Fare ({formData.passengers} × ₹{formData.price})</span>
                                <strong>₹{formData.price * formData.passengers}</strong>
                            </div>
                            <div className="price-row total">
                                <span>Total Amount</span>
                                <strong>₹{formData.totalPrice}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            📱 Send Booking Request
                        </button>
                    </div>

                    <p className="form-note">
                        * Your booking details will be sent via WhatsApp & Email. Our team will confirm shortly.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
