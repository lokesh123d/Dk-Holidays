import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { carService, reviewService, offerService } from '../services/apiService';
import { toast } from 'react-toastify';
import { useAuth } from '../utils/AuthContext';
import BookingModal from '../components/BookingModal';

import '../styles/pages/Home.css';

const Home = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [showFaq, setShowFaq] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);
    const { currentUser } = useAuth();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const handleBookNow = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsBookingModalOpen(true);
    };


    // Hero slider images
    // Hero slider images - Custom uploaded images
    const heroImages = [
        "/images/hero/hero-1.jpg",
        "/images/hero/hero-2.png",
        "/images/hero/hero-3.jpg",
        "/images/hero/hero-4.jpg",
        "/images/hero/hero-5.png",
        "/images/hero/hero-6.png",
        "/images/hero/hero-7.png",
        "/images/hero/hero-8.jpg"
    ];

    useEffect(() => {
        fetchCars();
        fetchReviews();
        fetchOffers();

        // Auto-refresh reviews and offers every 10 seconds
        const interval = setInterval(() => {
            fetchReviews();
            fetchOffers();
        }, 10000); // 10 seconds for faster updates

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        filterCars();
    }, [cars, searchTerm, categoryFilter, priceFilter]);

    // Auto-advance hero slider
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(timer);
    }, [heroImages.length]);

    const fetchCars = async () => {
        try {
            setLoading(true);
            // Timeout promise to force fallback if API is slow (Free tier cold starts)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 2000)
            );

            const apiPromise = carService.getAllCars();

            const response = await Promise.race([apiPromise, timeoutPromise]);

            if (response && response.data && response.data.length > 0) {
                setCars(response.data);
            } else {
                throw new Error("No data or API failed");
            }
        } catch (error) {
            // console.log('Using sample cars due to API delay/error');
            setCars(getSampleCars());
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await reviewService.getAllReviews();
            if (response.success) {
                setReviews(response.data || []);
            } else {
                setReviews(getSampleReviews());
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews(getSampleReviews());
        }
    };

    const fetchOffers = async () => {
        try {
            const response = await offerService.getAllOffers();
            if (response.success) {
                setOffers(response.data || []);
            } else {
                setOffers(getSampleOffers());
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
            setOffers(getSampleOffers());
        }
    };

    const filterCars = () => {
        let filtered = [...cars];

        if (searchTerm) {
            filtered = filtered.filter(car =>
                car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(car => car.category === categoryFilter);
        }

        if (priceFilter !== 'all') {
            const [min, max] = priceFilter.split('-').map(Number);
            if (max) {
                filtered = filtered.filter(car =>
                    parseFloat(car.price) >= min && parseFloat(car.price) <= max
                );
            } else {
                filtered = filtered.filter(car => parseFloat(car.price) >= min);
            }
        }

        setFilteredCars(filtered);
    };

    const getSampleCars = () => [
        {
            id: '1',
            name: 'Toyota Innova Crysta',
            category: 'SUV',
            price: '2500',
            seats: 7,
            doors: 4,
            transmission: 'Manual',
            likes: 156,
            image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80'
        },
        {
            id: '2',
            name: 'Maruti Suzuki Ertiga',
            category: 'Sedan',
            price: '1800',
            seats: 7,
            doors: 4,
            transmission: 'Manual',
            image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
            likes: 98
        },
        {
            id: '3',
            name: 'Tempo Traveller 12 Seater',
            category: 'Tempo Traveller',
            price: '4500',
            seats: 12,
            doors: 2,
            transmission: 'Manual',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
            likes: 234
        },
        {
            id: '4',
            name: 'Tempo Traveller 17 Seater',
            category: 'Tempo Traveller',
            price: '5500',
            seats: 17,
            doors: 2,
            transmission: 'Manual',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
            likes: 189
        },
        {
            id: '5',
            name: 'Bus 25 Seater',
            category: 'Bus',
            price: '7000',
            seats: 25,
            doors: 2,
            transmission: 'Manual',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            likes: 145
        }
    ];

    const getSampleReviews = () => [
        {
            id: 'r1',
            userName: 'Amit Kumar',
            rating: 5,
            comment: 'Excellent service! The Innova was clean and the driver was very professional.',
            date: '2023-10-15'
        },
        {
            id: 'r2',
            userName: 'Sneha Gupta',
            rating: 5,
            comment: 'We hired a Tempo Traveller for our family trip to Manali. It was a smooth and comfortable ride.',
            date: '2023-11-02'
        },
        {
            id: 'r3',
            userName: 'Rahul Verma',
            rating: 4,
            comment: 'Good commitment to timing. The car condition was great.',
            date: '2023-09-28'
        },
        {
            id: 'r4',
            userName: 'Priya Singh',
            rating: 5,
            comment: 'Best taxi service in Dharamshala. Highly recommended for tourists!',
            date: '2023-12-05'
        },
        {
            id: 'r5',
            userName: 'Rajesh Sharma',
            rating: 5,
            comment: 'Very reliable and affordable. Will definitely use again.',
            date: '2023-10-20'
        }
    ];

    const getSampleOffers = () => [
        {
            id: 'o1',
            title: 'Early Bird Discount',
            description: 'Book 15 days in advance and get 10% off on your trip.',
            code: 'EARLY10',
            discount: '10%'
        },
        {
            id: 'o2',
            title: 'Winter Special',
            description: 'Flat ₹500 off on Shimla-Manali tour packages.',
            code: 'WINTER500',
            discount: '₹500 OFF'
        },
        {
            id: 'o3',
            title: 'Weekend Getaway',
            description: '15% discount on Tempo Traveller bookings for weekends.',
            code: 'WKND15',
            discount: '15%'
        },
        {
            id: 'o4',
            title: 'Honeymoon Special',
            description: 'Special couple discount + free candlelight dinner voucher.',
            code: 'LOVE2024',
            discount: 'Special'
        },
        {
            id: 'o5',
            title: 'Group Booking',
            description: 'Book 2 or more cars and get flat 20% off.',
            code: 'GROUP20',
            discount: '20%'
        }
    ];

    const faqs = [
        {
            question: "Can I rent a car for a few weeks?",
            answer: "Yes, you can. However, this service may vary from one car rental company to another."
        },
        {
            question: "Do car rental companies also provide a driver with a car?",
            answer: "Yes, some car rental companies also provide a driver with a car on hire. However, this service may vary. It is advised to call the company ahead of time and ask about the same."
        },
        {
            question: "Will I be required to pay for any damage the car sustains while it is in my possession?",
            answer: "Yes, you would need to pay for any damage the car sustained during your possession. You can know more about the same by calling the company."
        },
        {
            question: "Where is the office of D K Holidays in Dharamshala?",
            answer: "The office of D K Holidays in Dharamshala is at Sidhpur, Near Norblinka Institute (Blossom Village Resort), Khaniara Road, Dharamshala-176215, Himachal Pradesh."
        },
        {
            question: "What are the working hours of D K Holidays in Dharamshala?",
            answer: "The operating hours of DK Holidays in Dharamshala are Monday - 9:00 am - 11:00 pm, Tuesday - Open 24 Hrs, Wednesday - Open 24 Hrs, Thursday - Open 24 Hrs, Friday - Open 24 Hrs, Saturday - Open 24 Hrs, Sunday - Open 24 Hrs."
        },
        {
            question: "Do D K Holidays have different types of cars available for hire?",
            answer: "Yes, D K Holidays has different types of cars such as SUVs, Sedans etc. available for hire/rent."
        },
        {
            question: "Can I hire a car for a weekend trip from D K Holidays?",
            answer: "Yes, you can. However, it is advised to call D K Holidays in advance to confirm the same."
        }
    ];

    const toggleFaq = (index) => {
        setShowFaq(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // GSAP Animation refs
    const titleRef = React.useRef(null);
    const descRef = React.useRef(null);
    const btnRef = React.useRef(null);

    useEffect(() => {
        // Dynamic import to avoid SSR issues if any
        import('gsap').then((gsapModule) => {
            const gsap = gsapModule.default;
            const tl = gsap.timeline();

            if (titleRef.current) {
                tl.fromTo(titleRef.current,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
                )
                    .fromTo(descRef.current,
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                        "-=0.5"
                    )
                    .fromTo(btnRef.current,
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                        "-=0.5"
                    );
            }
        });
    }, []);

    return (
        <div className="home-page">
            <Navbar />

            {/* Hero Section */}
            <section className="hero" id="hero">
                <div className="hero-slider">
                    {heroImages.map((image, index) => (
                        <div
                            key={index}
                            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${image})` }}
                        />
                    ))}
                    <div className="hero-overlay"></div>
                </div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <p className="hero-subtitle text-red">DK HOLIDAYS</p>
                            <h1 className="hero-title" ref={titleRef}>
                                <span className="text-white">A DESTINATION FOR</span><br />
                                <span className="text-white">ALL YOUR NEEDS</span>
                            </h1>
                            <p className="hero-description" ref={descRef}>
                                D K Holidays in Dharamshala is a reputed transportation company that has been providing top-notch solutions to meet diverse client needs. Located in the heart of Dharamshala, making it convenient for clients to access their services.
                            </p>
                            <div className="hero-actions" ref={btnRef} style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                <button className="cta-btn" onClick={() => document.getElementById('vehicle-fleet').scrollIntoView({ behavior: 'smooth' })}>
                                    EXPLORE VEHICLE FLEET
                                </button>
                                <button className="btn-secondary" style={{ padding: '15px 40px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', href: '/services' }}>
                                    VIEW SERVICES
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview Section */}
            <section className="overview-section" id="overview">
                <div className="container">
                    <h2 className="section-title">Overview</h2>
                    <p className="section-text">
                        The company offers a wide range of vehicles to suit every travel need. Their diverse fleet ensures they can accommodate any group size or travel requirement, ensuring comfort and satisfaction.
                    </p>
                </div>
            </section>

            {/* Services Navigation */}
            <section className="services-navigation" id="services">
                <div className="container">
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-description">
                        Explore our complete range of travel and protection services
                    </p>

                    <div className="services-nav-grid">

                        <Link to="/services/tickets" className="service-nav-card flight-card">
                            <div className="service-nav-icon">
                                <img src="/images/service-ticket.png" alt="Ticket Booking" />
                            </div>
                            <h3>Ticket Booking</h3>
                            <p>Book flights & trains tickets seamlessly</p>
                            <div className="service-nav-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </Link>

                        <Link to="/services/tours" className="service-nav-card train-card">
                            <div className="service-nav-icon">
                                <img src="/images/service-tour.png" alt="Tour Packages" />
                            </div>
                            <h3>Tour Packages</h3>
                            <p>Explore our exclusive holiday packages</p>
                            <div className="service-nav-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </Link>

                        <a
                            href="https://advisor.turtlemintinsurance.com/profile/1343125/manish_kumar"
                            className="service-nav-card insurance-card"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="service-nav-icon">
                                <img src="/images/service-insurance.png" alt="Insurance Services" />
                            </div>
                            <h3>Insurance Services</h3>
                            <p>Complete insurance solutions for your protection</p>
                            <div className="service-nav-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </a>

                        <a href="#vehicle-fleet" className="service-nav-card car-card">
                            <div className="service-nav-icon">
                                <img src="/images/service-car.png" alt="Car Rental" />
                            </div>
                            <h3>Car & Bike Rental</h3>
                            <p>Rent cars & bikes for your travel needs</p>
                            <div className="service-nav-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </a>
                    </div>
                </div>
            </section>



            {/* Commitment Section */}
            <section className="commitment-section" id="commitment">
                <div className="container">
                    <h2 className="section-title">Commitment</h2>
                    <p className="section-text">
                        D K Holidays in Dharamshala aims to provide more than just transportation: they deliver exceptional experiences that exceed expectations. Their dedicated team is ready to assist in selecting the right vehicle for your needs, ensuring a safe, comfortable, and memorable journey. They understand the crucial role transportation plays in travel experiences, whether for family vacations, business trips, corporate meetings, or special events.
                    </p>
                    <p className="section-text highlight-text">
                        Thank you for considering D K Holidays in Dharamshala, Dharamahala for your transportation needs. They look forward to serving you and ensuring your next journey is delightful and stress-free.
                    </p>
                </div>
            </section>

            {/* Vehicle Fleet Section */}
            <section className="vehicle-fleet" id="vehicle-fleet">
                <div className="container">
                    <h2 className="section-title">Our Vehicle Fleet</h2>
                    <p className="section-description">
                        Explore our diverse collection of cars and bikes
                    </p>

                    {/* Search and Filter Bar */}
                    <div className="search-filter-bar">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search vehicles by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="filter-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Tempo Traveller">Tempo Traveller</option>
                            <option value="Bus">Bus</option>
                            <option value="Bike">Bike</option>
                        </select>
                        <select
                            className="filter-select"
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                        >
                            <option value="all">All Prices</option>
                            <option value="0-2000">Under ₹2000</option>
                            <option value="2000-4000">₹2000 - ₹4000</option>
                            <option value="4000-6000">₹4000 - ₹6000</option>
                            <option value="6000">₹6000+</option>
                        </select>
                    </div>

                    {/* Cars Grid */}
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading vehicles...</p>
                        </div>
                    ) : (
                        <div className="vehicles-grid">
                            {filteredCars.map(car => (
                                <div key={car.id} className="vehicle-card">
                                    <div className="vehicle-image">
                                        <img src={car.image} alt={car.name} />
                                    </div>
                                    <div className="vehicle-info">
                                        <div className="vehicle-header">
                                            <h3 className="vehicle-name">{car.name}</h3>
                                            <div className="vehicle-rating">
                                                <span>{car.likes}</span>
                                            </div>
                                        </div>
                                        <div className="vehicle-specs">
                                            <span className="spec">{car.seats} Seats</span>
                                            <span className="spec">{car.transmission}</span>
                                            <span className="spec">{car.doors} Doors</span>
                                            <span className="spec">{car.category}</span>
                                        </div>
                                        <div className="vehicle-footer">
                                            <div className="price-info">
                                                <p className="price-label">Daily rate from</p>
                                                <p className="price">₹{car.price}</p>
                                            </div>
                                            <button className="rent-btn" onClick={() => handleBookNow(car)}>Book Now</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* Offers Section */}
            {offers.length > 0 && (
                <section className="offers-section" id="offers">
                    <div className="container">
                        <h2 className="section-title">Special Offers & Deals</h2>
                        <p className="section-description">Grab these exclusive discounts on your next booking!</p>

                        <div className="offers-grid">
                            {offers.map(offer => (
                                <div key={offer.id} className="offer-card">
                                    <div className="offer-badge">
                                        <span className="discount">{offer.discount}% OFF</span>
                                    </div>
                                    <h3>{offer.title}</h3>
                                    <p className="offer-description">{offer.description}</p>
                                    <div className="offer-details">
                                        <div className="promo-code">
                                            <span>Code: <strong>{offer.code}</strong></span>
                                        </div>
                                        <div className="offer-validity">
                                            <span>Valid till: {new Date(offer.validTill).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <button className="claim-offer-btn">
                                        Claim Offer
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Reviews Section */}
            {reviews.length > 0 && (
                <section className="reviews-section" id="reviews">
                    <div className="container">
                        <h2 className="section-title">What Our Customers Say</h2>
                        <p className="section-description">Real experiences from our valued customers</p>

                        <div className="reviews-grid">
                            {reviews.map(review => (
                                <div key={review.id} className="review-card">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <div className="reviewer-avatar">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=random&color=fff&size=128`}
                                                    alt={review.userName}
                                                />
                                            </div>
                                            <div>
                                                <h4>{review.userName}</h4>
                                                <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="review-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <i
                                                    key={i}
                                                    className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}
                                                ></i>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}




            {/* FAQ Section */}
            <section className="faq-section" id="faq">
                <div className="container">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <p className="section-description" style={{ color: '#666', marginBottom: '0' }}>
                        Everything you need to know about our services
                    </p>
                    <div className="faq-grid">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${showFaq[index] ? 'active' : ''}`}
                                onClick={() => toggleFaq(index)}
                            >
                                <div className="faq-question">
                                    <span>{faq.question}</span>
                                    <span className="faq-toggle"></span>
                                </div>
                                {showFaq[index] && (
                                    <p className="faq-answer">{faq.answer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Footer */}
            <Footer />

            {/* Booking Modal */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                selectedItem={selectedVehicle}
                currentUser={currentUser}
            />




        </div >
    );
}
export default Home;
