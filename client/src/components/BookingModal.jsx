import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { bookingService, paymentService } from '../services/apiService';
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

    const [paymentSettings, setPaymentSettings] = useState({
        enabled: false,
        provider: 'stripe'
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await paymentService.getSettings();
                if (res.success) {
                    setPaymentSettings(res.data);
                }
            } catch (err) {
                console.error("Failed to load payment settings", err);
            }
        };
        loadSettings();
    }, []);

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
            let price = selectedItem.price;
            if (bookingType === 'train' && extraData.class && selectedItem.classes) {
                price = selectedItem.classes[extraData.class];
            }
            return price * passengers;
        } else if (bookingType === 'tour') {
            const passengers = formData.passengers || 1;
            return selectedItem.price * passengers;
        }
        return 0;
    };

    const handleSubmit = async (e, paymentDetails = null) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            const total = calculateTotal();

            // 1. Prepare Booking Data (Generic approach)
            const bookingData = {
                user: currentUser ? currentUser.uid : 'guest',
                userName: formData.name,
                userEmail: formData.email,
                userPhone: formData.phone,
                bookingType: bookingType,
                itemId: selectedItem._id || selectedItem.id, // Support both MongoDB _id and local id
                itemTitle: selectedItem.name || selectedItem.title || selectedItem.airline + ' ' + selectedItem.flightNumber || 'Unknown Item',
                startDate: formData.date,
                endDate: formData.returnDate || null,
                totalAmount: total,
                status: paymentDetails ? 'confirmed' : 'pending',
                paymentStatus: paymentDetails ? 'paid' : 'pending',
                paymentDetails: paymentDetails || null,
                details: {
                    passengers: formData.passengers || extraData.passengers,
                    pickupLocation: formData.pickupLocation,
                    message: formData.message,
                    ...extraData,
                    ...formData // Ensure form data like passengers overrides extras if edited
                }
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

            if (paymentDetails) {
                message += `✅ *Paid Online* (ID: ${paymentDetails.paymentId})\n\n`;
            }

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
            } else if (bookingType === 'tour') {
                message += `*Package:* ${selectedItem.title}\n`;
                message += `*Duration:* ${selectedItem.duration}\n`;
                message += `*Preferred Date:* ${formData.date}\n`;
                message += `*Travelers:* ${formData.passengers || 1}\n`;
            }

            message += `\n*Customer Details:*\n`;
            message += `*Name:* ${formData.name}\n`;
            message += `*Phone:* ${formData.phone}\n`;
            message += `*Email:* ${formData.email}\n`;
            message += `\n*Est. Total:* ₹${total}\n`;
            if (formData.message) message += `*Note:* ${formData.message}`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/918626877277?text=${encodedMessage}`;

            // 4. Open WhatsApp
            window.open(whatsappUrl, '_blank');
            if (paymentDetails) {
                toast.success('Booking & Payment Successful! Redirecting to WhatsApp...');
            } else {
                toast.success('Redirecting to WhatsApp to complete your booking!');
            }
            onClose();

        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }

    };

    const handleOnlinePayment = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const total = calculateTotal();
            if (!total || total <= 0) {
                toast.error("Invalid total amount");
                setLoading(false);
                return;
            }

            // 1. Create Payment Intent (or Order)
            const intentRes = await paymentService.createPaymentIntent({
                amount: total,
                currency: 'inr',
                carId: selectedItem.id,
                bookingDetails: {
                    userName: formData.name,
                    userEmail: formData.email
                }
            });

            if (!intentRes.success) {
                throw new Error(intentRes.error || 'Payment initiation failed');
            }

            // RAZORPAY FLOW
            if (intentRes.provider === 'razorpay') {
                if (!window.Razorpay) {
                    toast.error("Razorpay SDK failed to load. Please check your connection.");
                    setLoading(false);
                    return;
                }

                const options = {
                    key: intentRes.publicKey, // Key ID
                    amount: intentRes.amount,
                    currency: intentRes.currency,
                    name: "D K Holidays",
                    description: `Booking for ${selectedItem.name || selectedItem.title}`,
                    image: "https://dk-holidays.web.app/logo.svg",
                    order_id: intentRes.orderId,
                    handler: function (response) {
                        // Payment Success!
                        toast.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                        console.log("Razorpay Response:", response);

                        // Proceed to submit booking with payment details
                        handleSubmit(null, {
                            provider: 'razorpay',
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            amount: total
                        });
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone
                    },
                    notes: {
                        address: "Dharamshala, HP"
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    toast.error(`Payment Failed: ${response.error.description}`);
                });
                rzp1.open();
                setLoading(false); // Stop loading as modal is open
                return;
            }

            // STRIPE FLOW (Existing)
            if (intentRes.provider === 'stripe') {
                const { clientSecret, publicKey } = intentRes;

                if (!window.Stripe) {
                    toast.error("Stripe is not loaded yet.");
                    return;
                }
                const stripe = window.Stripe(publicKey);

                // Mock integration message
                toast.success("Payment Gateway Initialized! (Mock - Integration Complete)");
                console.log("Payment Intent Created:", intentRes);

                // For Stripe, real confirmation happens via webhook or client-side confirmCardPayment.
                // For this mock/demo, we assume success:
                handleSubmit(null, {
                    provider: 'stripe',
                    paymentId: 'mock_stripe_id_' + Date.now(),
                    amount: total
                });
            }

        } catch (error) {
            console.error('Payment error:', error);
            const errorMsg = error.response?.data?.error || error.message || "Unknown error";
            toast.error('Payment failed: ' + errorMsg);
            setLoading(false); // Only stop loading on error, success is handled by callbacks
        }
    };



    // ... (helper functions same as before) ...
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
        if (bookingType === 'tour') return `${selectedItem.duration} • ₹${selectedItem.price}`;
        return "";
    };

    // Helper to get item image/icon
    const getItemImage = () => {
        if (bookingType === 'tour' && selectedItem.image) return selectedItem.image;
        if (bookingType === 'car') return selectedItem.image;
        if (bookingType === 'flight') return "https://cdn-icons-png.flaticon.com/128/2913/2913145.png"; // Generic flight icon
        if (bookingType === 'train') return "https://cdn-icons-png.flaticon.com/128/3448/3448339.png"; // Generic train icon
        if (bookingType === 'tour') return "https://cdn-icons-png.flaticon.com/128/2060/2060284.png"; // Generic tour map icon
        return "";
    };

    const getLabelForDate = () => {
        if (bookingType === 'car') return 'Pickup Date *';
        if (bookingType === 'tour') return 'Preferred Start Date *';
        return 'Departure/Journey Date *';
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

                <form className="booking-form" onSubmit={(e) => handleSubmit(e)}>
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
                            <label>{getLabelForDate()}</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                disabled={bookingType !== 'car' && bookingType !== 'tour'}
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

                        {bookingType === 'tour' && (
                            <div className="form-group">
                                <label>No. of Travelers *</label>
                                <input
                                    type="number"
                                    name="passengers"
                                    value={formData.passengers || 1}
                                    onChange={handleChange}
                                    min="1"
                                    required
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

                    <div className="bill-summary" style={{
                        marginBottom: '20px',
                        padding: '15px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px dashed #ced4da',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600', color: '#495057' }}>Total Amount</span>
                            <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>(Inclusive of all taxes)</span>
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                            ₹{calculateTotal().toLocaleString()}
                        </span>
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

                    {(bookingType === 'car' || bookingType === 'tour') && paymentSettings.enabled && (
                        <div className="payment-divider">
                            <span>OR</span>
                            <button
                                type="button" // Important: not submit type 
                                className="pay-online-btn"
                                onClick={handleOnlinePayment}
                                disabled={loading}
                                style={{ marginTop: '10px', width: '100%', background: '#6772e5', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                            >
                                <i className="fas fa-credit-card"></i> Pay Online Now
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
