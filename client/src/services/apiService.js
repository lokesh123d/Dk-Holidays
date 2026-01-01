import api from './api';

/**
 * Car API services
 */
export const carService = {
    // Get all cars
    getAllCars: async () => {
        try {
            const response = await api.get('/cars');
            return response.data;
        } catch (error) {
            console.log("API Error (Cars), returning empty array for fallback");
            return { success: false, data: [] };
        }
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
        try {
            const response = await api.get('/reviews');
            return response.data;
        } catch (error) {
            return { success: false, data: [] };
        }
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
        try {
            const response = await api.get('/offers');
            return response.data;
        } catch (error) {
            return { success: false, data: [] };
        }
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

/**
 * Flight API services
 */
export const flightService = {
    // Search flights
    searchFlights: async (searchParams) => {
        const response = await api.post('/flights/search', searchParams);
        return response.data;
    },

    // Get booking options
    getBookingOptions: async (bookingToken) => {
        const response = await api.post('/flights/booking-options', { bookingToken });
        return response.data;
    }
};

/**
 * Train API services
 */
export const trainService = {
    // Search trains
    searchTrains: async (searchParams) => {
        const response = await api.post('/trains/search', searchParams);
        return response.data;
    }
};

/**
 * Payment API services
 */
export const paymentService = {
    // Admin: Get payment settings
    getSettings: async () => {
        const response = await api.get('/payment/settings');
        return response.data;
    },

    // Admin: Update payment settings
    updateSettings: async (data) => {
        const response = await api.put('/payment/settings', data);
        return response.data;
    },

    // User: Create Payment Intent
    createPaymentIntent: async (data) => {
        const response = await api.post('/payment/create-payment-intent', data);
        return response.data;
    }
};

// Tour Service
export const tourService = {
    getAllTours: async () => {
        const response = await api.get('/tours');
        return response.data;
    },
    createTour: async (tourData) => {
        const response = await api.post('/tours', tourData);
        return response.data;
    },
    updateTour: async (id, tourData) => {
        const response = await api.put(`/tours/${id}`, tourData);
        return response.data;
    },
    deleteTour: async (id) => {
        const response = await api.delete(`/tours/${id}`);
        return response.data;
    }
};

export default {
    carService,
    bookingService,
    authService,
    contactService,
    reviewService,
    offerService,
    flightService,
    trainService,
    paymentService,
    tourService
};
