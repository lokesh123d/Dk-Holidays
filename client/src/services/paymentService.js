import api from './api';

const paymentService = {
    // Admin: Get payment settings
    getSettings: () => api.get('/payment/settings'),

    // Admin: Update payment settings
    updateSettings: (data) => api.put('/payment/settings', data),

    // User: Create Payment Intent
    createPaymentIntent: (data) => api.post('/payment/create-payment-intent', data)
};

export default paymentService;
