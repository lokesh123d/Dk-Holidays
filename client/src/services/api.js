import axios from 'axios';
import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('authToken');

        // Prefer live token from Firebase SDK to ensure it's not expired/stale rules
        if (auth.currentUser) {
            try {
                // getIdToken(false) returns cached token if valid, refreshes if expired
                // If we suspect claims changed, we might want true, but false is standard for performance
                token = await auth.currentUser.getIdToken();
                localStorage.setItem('authToken', token); // Sync local storage
            } catch (e) {
                console.error("Failed to get fresh token", e);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
