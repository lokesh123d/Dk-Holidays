import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { carService, reviewService, offerService } from '../services/apiService';
import { toast } from 'react-toastify';
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

    // Hero slider images
    const heroImages = [
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=1920&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1920&auto=format&fit=crop"
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
            const response = await carService.getAllCars();
            setCars(response.data || []);
        } catch (error) {
            console.error('Error fetching cars:', error);
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
                // Fallback to sample data if API fails
                setReviews([
                    {
                        id: '1',
                        userName: 'Rajesh Kumar',
                        rating: 5,
                        comment: 'Excellent service! The car was in perfect condition and the staff was very helpful.',
                        date: '2024-12-20'
                    },
                    {
                        id: '2',
                        userName: 'Priya Sharma',
                        rating: 5,
                        comment: 'Great experience with DK Holidays. Very professional service.',
                        date: '2024-12-18'
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            // Use sample data as fallback
            setReviews([]);
        }
    };

    const fetchOffers = async () => {
        try {
            const response = await offerService.getAllOffers();
            if (response.success) {
                setOffers(response.data || []);
            } else {
                // Fallback to sample data
                setOffers([
                    {
                        id: '1',
                        title: 'New Year Special',
                        description: 'Celebrate New Year with amazing discounts!',
                        discount: 25,
                        code: 'NEWYEAR25',
                        validTill: '2025-01-05'
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
            setOffers([]);
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
            image: 'data:image/jpeg;base64,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',
            likes: 156
        },
        {
            id: '2',
            name: 'Maruti Suzuki Ertiga',
            category: 'Sedan',
            price: '1800',
            seats: 7,
            doors: 4,
            transmission: 'Manual',
            image: '/images/ertiga.jpg',
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
            image: '/images/tempo-12.jpg',
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
            image: '/images/tempo-17.jpg',
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
            image: '/images/bus-25.jpg',
            likes: 145
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
            answer: "The office of D K Holidays in Dharamshala is Near Norbulingka Institute (Blossom Village Resort), Dharamshala."
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

                    {/* Navigation Arrows */}
                    <button
                        className="slider-nav prev"
                        onClick={() => setCurrentSlide((currentSlide - 1 + heroImages.length) % heroImages.length)}
                    >
                        ❮
                    </button>
                    <button
                        className="slider-nav next"
                        onClick={() => setCurrentSlide((currentSlide + 1) % heroImages.length)}
                    >
                        ❯
                    </button>

                    {/* Slider Dots */}
                    <div className="slider-dots">
                        {heroImages.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${currentSlide === index ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <p className="hero-subtitle">D K Holidays in Dharamshala, Dharamahala</p>
                            <h1 className="hero-title">
                                Premier <span className="highlight">Transportation</span><br />
                                Company Providing<br />
                                Top-Notch Solutions
                            </h1>
                            <p className="hero-description">
                                D K Holidays in Dharamshala is a reputed transportation company that has been providing<br />
                                top-notch solutions to meet diverse client needs. Located in the heart of Dharamahala,<br />
                                making it convenient for clients to access their services.
                            </p>
                            <button className="cta-btn" onClick={() => document.getElementById('vehicle-fleet').scrollIntoView({ behavior: 'smooth' })}>
                                Explore Our Fleet
                            </button>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3 className="stat-number">15+</h3>
                                    <p className="stat-label">Years<br />Experience</p>
                                </div>
                                <div className="stat-card">
                                    <h3 className="stat-number">50k+</h3>
                                    <p className="stat-label">Happy<br />Customers</p>
                                </div>
                                <div className="stat-card">
                                    <h3 className="stat-number">24/7</h3>
                                    <p className="stat-label">Available<br />Service</p>
                                </div>
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
                        <a href="/services/flights" className="service-nav-card flight-card">
                            <div className="service-nav-icon">
                                <img src="https://cdn-icons-png.flaticon.com/128/2913/2913145.png" alt="Flight" />
                            </div>
                            <h3>Flight Booking</h3>
                            <p>Book domestic & international flights at best prices</p>
                            <div className="service-nav-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </a>

                        <a href="/services/trains" className="service-nav-card train-card">
                            <div className="service-nav-icon">
                                <img src="https://cdn-icons-png.flaticon.com/128/3448/3448339.png" alt="Train" />
                            </div>
                            <h3>Train Booking</h3>
                            <p>Hassle-free railway ticket booking service</p>
                            <div className="service-nav-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </a>

                        <a
                            href="https://advisor.turtlemintinsurance.com/profile/1343125/manish_kumar"
                            className="service-nav-card insurance-card"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="service-nav-icon">
                                <img src="https://cdn-icons-png.flaticon.com/128/2331/2331966.png" alt="Insurance" />
                            </div>
                            <h3>Insurance Services</h3>
                            <p>Complete insurance solutions for your protection</p>
                            <div className="service-nav-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </a>

                        <a href="#vehicle-fleet" className="service-nav-card car-card">
                            <div className="service-nav-icon">
                                <img src="https://cdn-icons-png.flaticon.com/128/3448/3448432.png" alt="Car Rental" />
                            </div>
                            <h3>Car Rental</h3>
                            <p>Wide range of vehicles for all your travel needs</p>
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
                        Explore our diverse collection of well-maintained vehicles
                    </p>

                    {/* Search and Filter Bar */}
                    <div className="search-filter-bar">
                        <div className="search-box">
                            <i className="fas fa-search"></i>
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
                                                <i className="fas fa-heart"></i>
                                                <span>{car.likes}</span>
                                            </div>
                                        </div>
                                        <div className="vehicle-specs">
                                            <span className="spec"><i className="fas fa-user"></i> {car.seats} Seats</span>
                                            <span className="spec"><i className="fas fa-cog"></i> {car.transmission}</span>
                                            <span className="spec"><i className="fas fa-door-closed"></i> {car.doors} Doors</span>
                                            <span className="spec"><i className="fas fa-car"></i> {car.category}</span>
                                        </div>
                                        <div className="vehicle-footer">
                                            <div className="price-info">
                                                <p className="price-label">Daily rate from</p>
                                                <p className="price">₹{car.price}</p>
                                            </div>
                                            <button className="rent-btn">Book Now</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* Offers Section */}
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
                                        <i className="fas fa-tag"></i>
                                        <span>Code: <strong>{offer.code}</strong></span>
                                    </div>
                                    <div className="offer-validity">
                                        <i className="fas fa-calendar"></i>
                                        <span>Valid till: {new Date(offer.validTill).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button className="claim-offer-btn">
                                    <i className="fas fa-gift"></i> Claim Offer
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
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




            {/* FAQ Section */}
            <section className="faq-section" id="faq">
                <div className="container">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        {faqs.map((faq, index) => (
                            <div key={index} className="faq-item" onClick={() => toggleFaq(index)}>
                                <div className="faq-question">
                                    <i className="fas fa-question-circle"></i>
                                    <span>{faq.question}</span>
                                    <i className={`fas fa-chevron-${showFaq[index] ? 'up' : 'down'} faq-toggle`}></i>
                                </div>
                                {showFaq[index] && (
                                    <p className="faq-answer">{faq.answer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Contact Form Section */}
            <section className="contact-form-section" id="contact">
                <div className="container">
                    <h2 className="section-title">Get In Touch</h2>
                    <p className="section-description">Have a question? Send us a message and we'll get back to you shortly</p>

                    <div className="contact-form-wrapper">
                        <form className="contact-form" onSubmit={(e) => {
                            e.preventDefault();
                            toast.success('Thank you for your message! We will contact you soon.');
                            e.target.reset();
                        }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Your Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Your Email *</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <input
                                        type="text"
                                        placeholder="Subject of your message"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    rows="5"
                                    placeholder="Write your message here..."
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="submit-contact-btn">
                                <i className="fas fa-paper-plane"></i>
                                Send Message
                            </button>
                        </form>

                        <div className="contact-info-sidebar">
                            <div className="info-card">
                                <i className="fas fa-map-marker-alt"></i>
                                <h4>Location</h4>
                                <p>Near Norbulingka Institute, Dharamshala</p>
                            </div>
                            <div className="info-card">
                                <i className="fas fa-phone"></i>
                                <h4>Call Us</h4>
                                <p>+91 91782 12412</p>
                            </div>
                            <div className="info-card">
                                <i className="fas fa-envelope"></i>
                                <h4>Email</h4>
                                <p>info@dkholidays.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WhatsApp Float Button */}
            <a
                href="https://wa.me/919178212412"
                className="whatsapp-float"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
            >
                <i className="fab fa-whatsapp"></i>
            </a>
        </div >
    );
};

export default Home;
