import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Styles
import './styles/App.css';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ScrollToTop Component
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);

        // Refresh ScrollTrigger after route change
        setTimeout(() => {
            ScrollTrigger.refresh();

            // Re-apply animations to new content
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                gsap.fromTo(section,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // Animate Cards
            const cards = document.querySelectorAll('.vehicle-card, .offer-card, .review-card, .service-nav-card');
            gsap.fromTo(cards,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: cards[0]?.parentElement || cards[0], // Trigger when parent comes into view
                        start: 'top 85%'
                    }
                }
            );

        }, 100); // Small delay to ensure DOM is ready

    }, [pathname]);

    return null;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    theme="dark"
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
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
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
