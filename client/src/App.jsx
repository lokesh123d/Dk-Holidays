import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';
import CarDetails from './pages/CarDetails';
import Services from './pages/Services';
import FlightBooking from './pages/FlightBooking';
import TrainBooking from './pages/TrainBooking';
import Insurance from './pages/Insurance';
import Contact from './pages/Contact';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Styles
import './styles/App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    theme="light"
                />
                <div className="App">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/cars/:id" element={<CarDetails />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/flights" element={<FlightBooking />} />
                        <Route path="/services/trains" element={<TrainBooking />} />
                        <Route path="/services/insurance" element={<Insurance />} />
                        <Route path="/contact" element={<Contact />} />

                        {/* Protected Routes */}
                        <Route
                            path="/my-bookings"
                            element={
                                <PrivateRoute>
                                    <MyBookings />
                                </PrivateRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
