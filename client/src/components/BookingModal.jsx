import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { bookingService } from '../services/apiService';
import '../styles/components/BookingModal.css';

const BookingModal = ({ isOpen, onClose, selectedItem, currentUser, bookingType = 'car', extraData = {} }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '', // Generic date (pickup or flight/train date)
        returnDate: '', // For round trip or car return
        pickupLocation: '', // For car
        message: ''
    });

    // Reset and Pre-fill data
    // Reset and Pre-fill data
    useEffect(() => {
        if (isOpen) {
            // Set User Data
            if (currentUser) {
                setFormData(prev => ({
                    ...prev,
                    name: currentUser.displayName || prev.name || '',
                    email: currentUser.email || prev.email || '',
                    phone: currentUser.phoneNumber || prev.phone || ''
                }));
            }

            // Set Dates from extraData (Flight/Train search)
            if (extraData.date) {
                setFormData(prev => ({ ...prev, date: extraData.date }));
            }
            if (extraData.returnDate) {
                setFormData(prev => ({ ...prev, returnDate: extraData.returnDate }));
            }
        }
    }, [isOpen]); // Only run when modal opens to avoid resetting while typing

    if (!isOpen || !selectedItem) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Calculate Totals
    const calculateTotal = () => {
        if (bookingType === 'car') {
            if (!formData.date || !formData.returnDate) return 0;
            const start = new Date(formData.date);
            const end = new Date(formData.returnDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            return diffDays * parseFloat(selectedItem.price);
        } else if (bookingType === 'flight' || bookingType === 'train') {
            const passengers = extraData.passengers || 1;
            // Flight/Train price might be computed in extraData or Item
            // Usually item.price is per person
            let price = selectedItem.price;
            if (bookingType === 'train' && extraData.class && selectedItem.classes) {
                price = selectedItem.classes[extraData.class];
            }
            return price * passengers;
        }
        return 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const total = calculateTotal();

            // 1. Prepare Booking Data (Generic approach)
            const bookingData = {
                type: bookingType,
                itemId: selectedItem.id,
                itemName: selectedItem.name || selectedItem.airline || selectedItem.trainName, // Handle different objects
                details: {
                    ...formData,
                    ...extraData, // Include class, passengers etc
                    totalPrice: total
                },
                userEmail: formData.email,
                userName: formData.name,
                userPhone: formData.phone,
                status: 'pending'
            };

            // 2. DB Save (if user is logged in)
            if (currentUser) {
                try {
                    await bookingService.createBooking(bookingData);
                } catch (err) {
                    console.error("Booking db save failed", err);
                }
            }

            // 3. Construct WhatsApp Message
            let message = `*New ${bookingType.toUpperCase()} Booking Request* 🎫\n\n`;

            if (bookingType === 'car') {
                const start = new Date(formData.date);
                const end = new Date(formData.returnDate);
                const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;

                message += `*Vehicle:* ${selectedItem.name}\n`;
                message += `*Dates:* ${formData.date} to ${formData.returnDate} (${diffDays} days)\n`;
                message += `*Location:* ${formData.pickupLocation}\n`;
            } else if (bookingType === 'flight') {
                message += `*Airline:* ${selectedItem.airline} (${selectedItem.flightNumber})\n`;
                message += `*Route:* ${selectedItem.from} ➝ ${selectedItem.to}\n`;
                message += `*Date:* ${formData.date}\n`;
                if (extraData.returnDate) message += `*Return:* ${extraData.returnDate}\n`;
                message += `*Passengers:* ${extraData.passengers}\n`;
            } else if (bookingType === 'train') {
                message += `*Train:* ${selectedItem.name} (${selectedItem.trainNumber})\n`;
                message += `*Route:* ${selectedItem.from} ➝ ${selectedItem.to}\n`;
                message += `*Date:* ${formData.date}\n`;
                message += `*Class:* ${extraData.class ? extraData.class.toUpperCase() : 'N/A'}\n`;
                message += `*Passengers:* ${extraData.passengers}\n`;
            }

            message += `\n*Customer Details:*\n`;
            message += `*Name:* ${formData.name}\n`;
            message += `*Phone:* ${formData.phone}\n`;
            message += `*Email:* ${formData.email}\n`;
            message += `\n*Est. Total:* ₹${total}\n`;
            if (formData.message) message += `*Note:* ${formData.message}`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/918091780737?text=${encodedMessage}`;

            // 4. Open WhatsApp
            window.open(whatsappUrl, '_blank');
            toast.success('Redirecting to WhatsApp to complete your booking!');
            onClose();

        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Helper to get item image/icon
    const getItemImage = () => {
        if (bookingType === 'car') return selectedItem.image;
        if (bookingType === 'flight') return "https://cdn-icons-png.flaticon.com/128/2913/2913145.png"; // Generic flight icon
        if (bookingType === 'train') return "https://cdn-icons-png.flaticon.com/128/3448/3448339.png"; // Generic train icon
        return "";
    };

    // Helper to get item title
    const getItemTitle = () => {
        if (bookingType === 'car') return selectedItem.name;
        if (bookingType === 'flight') return `${selectedItem.airline} - ${selectedItem.flightNumber}`;
        if (bookingType === 'train') return `${selectedItem.name} (${selectedItem.trainNumber})`;
        return "Booking Item";
    };

    // Helper to get item subtitle
    const getItemSubtitle = () => {
        if (bookingType === 'car') return `₹${selectedItem.price}/day • ${selectedItem.category}`;
        if (bookingType === 'flight') return `${selectedItem.from} ➝ ${selectedItem.to} • ${selectedItem.duration}`;
        if (bookingType === 'train') return `${selectedItem.from} ➝ ${selectedItem.to} • ${selectedItem.duration}`;
        return "";
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Book {bookingType.charAt(0).toUpperCase() + bookingType.slice(1)}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="item-summary">
                    <img src={getItemImage()} alt="Item" style={{ objectFit: 'contain', padding: '5px', background: 'rgba(255,255,255,0.1)' }} />
                    <div className="item-details">
                        <h4>{getItemTitle()}</h4>
                        <p>{getItemSubtitle()}</p>
                    </div>
                </div>

                <form className="booking-form" onSubmit={handleSubmit}>
                    <div className="form-row">
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
                        <div className="form-group">
                            <label>Mobile Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="Enter numeric (e.g. 9876543210)"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Date Fields Logic */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>{bookingType === 'car' ? 'Pickup Date *' : 'Departure/Journey Date *'}</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                disabled={bookingType !== 'car'} // Read-only for flight/train as it comes from search
                            />
                        </div>

                        {(bookingType === 'car' || (bookingType === 'flight' && extraData.returnDate)) && (
                            <div className="form-group">
                                <label>Return Date {bookingType === 'car' ? '*' : ''}</label>
                                <input
                                    type="date"
                                    name="returnDate"
                                    value={formData.returnDate}
                                    onChange={handleChange}
                                    required={bookingType === 'car'}
                                    min={formData.date || new Date().toISOString().split('T')[0]}
                                    disabled={bookingType !== 'car'}
                                />
                            </div>
                        )}
                    </div>

                    {bookingType === 'car' && (
                        <div className="form-group">
                            <label>Pickup Location *</label>
                            <input
                                type="text"
                                name="pickupLocation"
                                value={formData.pickupLocation}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Dharamshala Airport, Bus Stand"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Any Special Request</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Meal preference? Wheelchair? Driver needed?"
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-booking-btn" disabled={loading}>
                        {loading ? 'Processing...' : (
                            <>
                                <i className="fab fa-whatsapp"></i> Confirm & Book via WhatsApp
                            </>
                        )}
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        * Redirects to WhatsApp Admin
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
