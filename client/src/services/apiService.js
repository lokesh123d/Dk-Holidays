import api from './api';

/**
 * Car API services
 */
export const carService = {
    // Get all cars
    getAllCars: async () => {
        const response = await api.get('/cars');
        return response.data;
    },

    // Get car by ID
    getCarById: async (id) => {
        const response = await api.get(`/cars/${id}`);
        return response.data;
    },

    // Search cars
    searchCars: async (params) => {
        const response = await api.get('/cars/search', { params });
        return response.data;
    },

    // Create car (Admin)
    createCar: async (carData) => {
        const response = await api.post('/cars', carData);
        return response.data;
    },

    // Update car (Admin)
    updateCar: async (id, carData) => {
        const response = await api.put(`/cars/${id}`, carData);
        return response.data;
    },

    // Delete car (Admin)
    deleteCar: async (id) => {
        const response = await api.delete(`/cars/${id}`);
        return response.data;
    }
};

/**
 * Booking API services
 */
export const bookingService = {
    // Create booking
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    // Get all bookings (Admin)
    getAllBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },

    // Get user bookings
    getUserBookings: async () => {
        const response = await api.get('/bookings/user');
        return response.data;
    },

    // Get booking by ID
    getBookingById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    // Update booking status (Admin)
    updateBookingStatus: async (id, status) => {
        const response = await api.put(`/bookings/${id}/status`, { status });
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (id) => {
        const response = await api.put(`/bookings/${id}/cancel`);
        return response.data;
    }
};

/**
 * Auth API services
 */
export const authService = {
    // Verify user token
    verifyUser: async () => {
        const response = await api.post('/auth/verify');
        return response.data;
    },

    // Get all users (Admin)
    getAllUsers: async () => {
        const response = await api.get('/auth/users');
        return response.data;
    },

    // Set admin role (Admin)
    setAdminRole: async (uid, isAdmin) => {
        const response = await api.post('/auth/admin/set-role', { uid, isAdmin });
        return response.data;
    },

    // Delete user (Admin)
    deleteUser: async (uid) => {
        const response = await api.delete(`/auth/users/${uid}`);
        return response.data;
    }
};

/**
 * Contact API services
 */
export const contactService = {
    // Submit contact form
    submitContactForm: async (formData) => {
        const response = await api.post('/contact', formData);
        return response.data;
    },

    // Get all contacts (Admin)
    getAllContacts: async () => {
        const response = await api.get('/contact');
        return response.data;
    },

    // Subscribe to newsletter
    subscribeNewsletter: async (email) => {
        const response = await api.post('/contact/newsletter', { email });
        return response.data;
    },

    // Get newsletter subscribers (Admin)
    getNewsletterSubscribers: async () => {
        const response = await api.get('/contact/newsletter');
        return response.data;
    }
};

/**
 * Review API services
 */
export const reviewService = {
    // Get all reviews
    getAllReviews: async () => {
        const response = await api.get('/reviews');
        return response.data;
    },

    // Create review (Admin)
    createReview: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },

    // Delete review (Admin)
    deleteReview: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    }
};

/**
 * Offer API services
 */
export const offerService = {
    // Get all offers
    getAllOffers: async () => {
        const response = await api.get('/offers');
        return response.data;
    },

    // Create offer (Admin)
    createOffer: async (offerData) => {
        const response = await api.post('/offers', offerData);
        return response.data;
    },

    // Delete offer (Admin)
    deleteOffer: async (id) => {
        const response = await api.delete(`/offers/${id}`);
        return response.data;
    }
};
