const { db } = require('../config/firebase');
const nodemailer = require('nodemailer');

// Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Env var for admin email
        pass: process.env.EMAIL_PASS  // Env var for app password
    }
});

/**
 * Create new booking
 */
const createBooking = async (req, res) => {
    try {
        const bookingData = {
            ...req.body,
            userId: req.user?.uid || 'guest',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const bookingRef = await db.collection('bookings').add(bookingData);


        // Send Email Notification
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'lokesh25@gmail.com',
                subject: `New Booking Request: ${bookingData.type.toUpperCase()}`,
                text: `
New Booking Request Received!

Service: ${bookingData.type.toUpperCase()}
Item: ${bookingData.itemName}

Customer Details:
Name: ${bookingData.userName}
Phone: ${bookingData.userPhone}
Email: ${bookingData.userEmail}

Booking Details:
Date: ${bookingData.details.date}
${bookingData.details.returnDate ? `Return Date: ${bookingData.details.returnDate}` : ''}
${bookingData.details.pickupLocation ? `PickUp: ${bookingData.details.pickupLocation}` : ''}
${bookingData.details.message ? `Note: ${bookingData.details.message}` : ''}

Est. Price: ₹${bookingData.details.totalPrice}
                `
            };
            await transporter.sendMail(mailOptions);
            console.log("Email notification sent to lokesh25@gmail.com");
        } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
            // Non-blocking error
        }

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: { id: bookingRef.id, ...bookingData }
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

/**
 * Get all bookings (Admin only)
 */
const getAllBookings = async (req, res) => {
    try {
        const bookingsSnapshot = await db.collection('bookings')
            .orderBy('createdAt', 'desc')
            .get();

        const bookings = [];
        bookingsSnapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

/**
 * Get user bookings
 */
const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.uid;
        const bookingsSnapshot = await db.collection('bookings')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const bookings = [];
        bookingsSnapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

/**
 * Get booking by ID
 */
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const bookingDoc = await db.collection('bookings').doc(id).get();

        if (!bookingDoc.exists) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const bookingData = bookingDoc.data();

        // Check if user owns this booking or is admin
        if (bookingData.userId !== req.user.uid && !req.user.admin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ success: true, data: { id: bookingDoc.id, ...bookingData } });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
};

/**
 * Update booking status (Admin only)
 */
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.collection('bookings').doc(id).update({
            status,
            updatedAt: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Booking status updated successfully'
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: 'Failed to update booking' });
    }
};

/**
 * Cancel booking
 */
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const bookingDoc = await db.collection('bookings').doc(id).get();

        if (!bookingDoc.exists) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const bookingData = bookingDoc.data();

        // Check if user owns this booking or is admin
        if (bookingData.userId !== req.user.uid && !req.user.admin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await db.collection('bookings').doc(id).update({
            status: 'cancelled',
            updatedAt: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking
};
