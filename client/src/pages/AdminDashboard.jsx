
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { carService, bookingService, authService, contactService, reviewService, offerService, paymentService, tourService } from '../services/apiService';
import { toast } from 'react-toastify';
import '../styles/pages/AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('cars');
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [offers, setOffers] = useState([]);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal states
    const [showAddCarModal, setShowAddCarModal] = useState(false);
    const [showEditCarModal, setShowEditCarModal] = useState(false);
    const [showAddReviewModal, setShowAddReviewModal] = useState(false);
    const [showAddOfferModal, setShowAddOfferModal] = useState(false);
    const [showMakeAdminModal, setShowMakeAdminModal] = useState(false);
    const [showAddTourModal, setShowAddTourModal] = useState(false);
    const [vehicleTypeChoice, setVehicleTypeChoice] = useState(null);

    const [editingCar, setEditingCar] = useState(null);

    // Form states
    const [carForm, setCarForm] = useState({
        name: '',
        category: '',
        price: '',
        seats: '',
        doors: '',
        transmission: '',
        image: '',
        description: ''
    });

    const [tourForm, setTourForm] = useState({
        title: '',
        description: '',
        duration: '',
        price: '',
        image: '',
        features: ''
    });

    const [reviewForm, setReviewForm] = useState({
        userName: '',
        userEmail: '',
        rating: 5,
        comment: '',
        carId: ''
    });

    const [offerForm, setOfferForm] = useState({
        title: '',
        description: '',
        discount: '',
        validTill: '',
        code: ''
    });

    const [adminForm, setAdminForm] = useState({
        userEmail: '',
        uid: ''
    });



    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'cars':
                    const carsData = await carService.getAllCars();
                    setCars(carsData.data || []);
                    break;
                case 'bookings':
                    const bookingsData = await bookingService.getAllBookings();
                    setBookings(bookingsData.data || []);
                    break;
                case 'users':
                    const usersData = await authService.getAllUsers();
                    setUsers(usersData.data || []);
                    break;
                case 'contacts':
                    const contactsData = await contactService.getAllContacts();
                    setContacts(contactsData.data || []);
                    break;
                case 'reviews':
                    const reviewsData = await reviewService.getAllReviews();
                    setReviews(reviewsData.data || []);
                    break;
                case 'offers':
                    const offersData = await offerService.getAllOffers();
                    setOffers(offersData.data || []);
                    break;
                case 'tours':
                    const toursData = await tourService.getAllTours();
                    setTours(toursData.data || []);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCar = async (e) => {
        e.preventDefault();
        try {
            // Ensure category matches selection if somehow desynced
            if (vehicleTypeChoice === 'bike') {
                carForm.category = 'Bike';
                carForm.doors = 0;
            }

            await carService.createCar(carForm);
            toast.success('Vehicle added successfully!');
            setShowAddCarModal(false);
            setCarForm({
                name: '',
                category: '',
                price: '',
                seats: '',
                doors: '',
                transmission: '',
                image: '',
                description: ''
            });
            fetchData();
        } catch (error) {
            console.error('Error adding vehicle:', error);
            toast.error('Failed to add vehicle: ' + error.message);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            await reviewService.createReview(reviewForm);
            toast.success('Review added successfully!');
            setShowAddReviewModal(false);
            setReviewForm({
                userName: '',
                userEmail: '',
                rating: 5,
                comment: '',
                carId: ''
            });
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('Failed to add review: ' + error.message);
        }
    };

    const handleAddOffer = async (e) => {
        e.preventDefault();
        try {
            await offerService.createOffer(offerForm);
            toast.success('Offer added successfully!');
            setShowAddOfferModal(false);
            setOfferForm({
                title: '',
                description: '',
                discount: '',
                validTill: '',
                code: ''
            });
            fetchData();
        } catch (error) {
            console.error('Error adding offer:', error);
            toast.error('Failed to add offer: ' + error.message);
        }
    };

    const handleAddTour = async (e) => {
        e.preventDefault();
        try {
            await tourService.createTour(tourForm);
            toast.success('Tour package added successfully!');
            setShowAddTourModal(false);
            setTourForm({
                title: '',
                description: '',
                duration: '',
                price: '',
                image: '',
                features: ''
            });
            fetchData(); // Refresh list
        } catch (error) {
            console.error('Error adding tour:', error);
            toast.error('Failed to add tour: ' + error.message);
        }
    };

    const handleDeleteTour = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tour package?')) return;
        try {
            await tourService.deleteTour(id);
            toast.success('Tour package deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting tour:', error);
            toast.error('Failed to delete tour: ' + error.message);
        }
    };

    const handleMakeAdmin = async (e) => {
        e.preventDefault();
        try {
            await authService.setAdminRole(adminForm.uid, true);
            toast.success('User granted admin access successfully!');
            setShowMakeAdminModal(false);
            setAdminForm({ userEmail: '', uid: '' });
            fetchData();
        } catch (error) {
            console.error('Error making admin:', error);
            toast.error('Failed to grant admin access: ' + error.message);
        }
    };

    const handleDeleteCar = async (carId) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return;

        try {
            await carService.deleteCar(carId);
            toast.success('Car deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting car:', error);
            toast.error('Failed to delete car: ' + error.message);
        }
    };

    const handleEditCar = (car) => {
        setEditingCar(car);
        setCarForm({
            name: car.name,
            category: car.category,
            price: car.price,
            seats: car.seats,
            doors: car.doors,
            transmission: car.transmission,
            image: car.image || '',
            description: car.description || ''
        });
        setShowEditCarModal(true);
    };

    const handleUpdateCar = async (e) => {
        e.preventDefault();
        try {
            await carService.updateCar(editingCar.id, carForm);
            toast.success('Car updated successfully!');
            setShowEditCarModal(false);
            setEditingCar(null);
            setCarForm({
                name: '',
                category: '',
                price: '',
                seats: '',
                doors: '',
                transmission: '',
                image: '',
                description: ''
            });
            fetchData();
        } catch (error) {
            console.error('Error updating car:', error);
            toast.error('Failed to update car: ' + error.message);
        }
    };

    const handleUpdateBookingStatus = async (bookingId, status) => {
        try {
            await bookingService.updateBookingStatus(bookingId, status);
            toast.success('Booking status updated successfully!');
            fetchData();
        } catch (error) {
            console.error('Error updating booking status:', error);
            toast.error('Failed to update booking status: ' + error.message);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await reviewService.deleteReview(reviewId);
            toast.success('Review deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review: ' + error.message);
        }
    };

    const handleDeleteOffer = async (offerId) => {
        try {
            await offerService.deleteOffer(offerId);
            toast.success('Offer deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting offer:', error);
            toast.error('Failed to delete offer: ' + error.message);
        }
    };



    return (
        <div className="admin-dashboard-page">
            <Navbar />

            <div className="admin-container">
                <aside className="admin-sidebar">
                    <h2>Admin Panel</h2>
                    <nav className="admin-nav">
                        <button
                            className={activeTab === 'cars' ? 'active' : ''}
                            onClick={() => setActiveTab('cars')}
                        >
                            <i className="fas fa-car"></i> Manage Cars
                        </button>
                        <button
                            className={activeTab === 'bookings' ? 'active' : ''}
                            onClick={() => setActiveTab('bookings')}
                        >
                            <i className="fas fa-calendar-alt"></i> Manage Bookings
                        </button>
                        <button
                            className={activeTab === 'users' ? 'active' : ''}
                            onClick={() => setActiveTab('users')}
                        >
                            <i className="fas fa-users"></i> Manage Users
                        </button>
                        <button
                            className={activeTab === 'contacts' ? 'active' : ''}
                            onClick={() => setActiveTab('contacts')}
                        >
                            <i className="fas fa-envelope"></i> Contact Messages
                        </button>
                        <button
                            className={activeTab === 'reviews' ? 'active' : ''}
                            onClick={() => setActiveTab('reviews')}
                        >
                            <i className="fas fa-star"></i> Reviews
                        </button>
                        <button
                            className={activeTab === 'offers' ? 'active' : ''}
                            onClick={() => setActiveTab('offers')}
                        >
                            <i className="fas fa-tags"></i> Offers
                        </button>
                        <button
                            className={activeTab === 'tours' ? 'active' : ''}
                            onClick={() => setActiveTab('tours')}
                        >
                            <i className="fas fa-map-marked-alt"></i> Tours
                        </button>

                    </nav>
                </aside>

                <main className="admin-content">
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <>
                            {/* Cars Tab */}
                            {activeTab === 'cars' && (
                                <div className="admin-section">
                                    <div className="section-header">
                                        <h1>Manage Vehicles</h1>
                                        <button className="add-btn" onClick={() => { setShowAddCarModal(true); setVehicleTypeChoice(null); }}>
                                            <i className="fas fa-plus"></i> Add Vehicle
                                        </button>
                                    </div>

                                    <div className="data-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Category</th>
                                                    <th>Price/Day</th>
                                                    <th>Seats</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cars.map(car => (
                                                    <tr key={car.id}>
                                                        <td>{car.name}</td>
                                                        <td>{car.category}</td>
                                                        <td>₹{car.price}</td>
                                                        <td>{car.seats}</td>
                                                        <td>
                                                            <button
                                                                className="edit-btn"
                                                                onClick={() => handleEditCar(car)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="delete-btn"
                                                                onClick={() => handleDeleteCar(car.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                            }

                            {/* Bookings Tab */}
                            {
                                activeTab === 'bookings' && (
                                    <div className="admin-section">
                                        <h1>Manage Bookings</h1>

                                        <div className="data-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Customer</th>
                                                        <th>Car</th>
                                                        <th>Pickup Date</th>
                                                        <th>Status</th>
                                                        <th>Total</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bookings.map(booking => (
                                                        <tr key={booking.id}>
                                                            <td>{booking.name}</td>
                                                            <td>{booking.carName}</td>
                                                            <td>{new Date(booking.pickupDate).toLocaleDateString()}</td>
                                                            <td>
                                                                <span className={'status-' + booking.status}>
                                                                    {booking.status}
                                                                </span>
                                                            </td>
                                                            <td>₹{booking.totalPrice}</td>
                                                            <td>
                                                                {booking.status === 'pending' && (
                                                                    <>
                                                                        <button
                                                                            className="approve-btn"
                                                                            onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                                                        >
                                                                            Approve
                                                                        </button>
                                                                        <button
                                                                            className="reject-btn"
                                                                            onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Users Tab */}
                            {
                                activeTab === 'users' && (
                                    <div className="admin-section">
                                        <div className="section-header">
                                            <h1>Manage Users</h1>
                                            <button className="add-btn" onClick={() => setShowMakeAdminModal(true)}>
                                                <i className="fas fa-user-shield"></i> Make Admin
                                            </button>
                                        </div>

                                        <div className="data-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Email</th>
                                                        <th>Display Name</th>
                                                        <th>Created</th>
                                                        <th>Role</th>
                                                        <th>UID</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map(user => (
                                                        <tr key={user.uid}>
                                                            <td>{user.email}</td>
                                                            <td>{user.displayName || 'N/A'}</td>
                                                            <td>{new Date(user.metadata.creationTime).toLocaleDateString()}</td>
                                                            <td>
                                                                <span className={user.customClaims?.admin ? 'badge-admin' : 'badge-user'}>
                                                                    {user.customClaims?.admin ? 'Admin' : 'User'}
                                                                </span>
                                                            </td>
                                                            <td><code>{user.uid}</code></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Reviews Tab */}
                            {
                                activeTab === 'reviews' && (
                                    <div className="admin-section">
                                        <div className="section-header">
                                            <h1>Manage Reviews</h1>
                                            <button className="add-btn" onClick={() => setShowAddReviewModal(true)}>
                                                <i className="fas fa-plus"></i> Add Review
                                            </button>
                                        </div>
                                        <div className="table-container">
                                            {reviews.length > 0 ? (
                                                <table className="admin-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Customer Name</th>
                                                            <th>Email</th>
                                                            <th>Rating</th>
                                                            <th>Comment</th>
                                                            <th>Date</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {reviews.map(review => (
                                                            <tr key={review.id}>
                                                                <td>{review.userName}</td>
                                                                <td>{review.userEmail}</td>
                                                                <td>
                                                                    <span className="rating-stars">
                                                                        {'⭐'.repeat(review.rating)}
                                                                    </span>
                                                                </td>
                                                                <td>{review.comment ? review.comment.substring(0, 100) : 'No comment'}{review.comment && review.comment.length > 100 ? '...' : ''}</td>
                                                                <td>{new Date(review.date).toLocaleDateString()}</td>
                                                                <td>
                                                                    <button
                                                                        className="delete-btn"
                                                                        onClick={() => handleDeleteReview(review.id)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="no-data">No reviews yet. Add your first review!</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            }

                            {/* Offers Tab */}
                            {
                                activeTab === 'offers' && (
                                    <div className="admin-section">
                                        <div className="section-header">
                                            <h1>Manage Offers</h1>
                                            <button className="add-btn" onClick={() => setShowAddOfferModal(true)}>
                                                <i className="fas fa-plus"></i> Add Offer
                                            </button>
                                        </div>
                                        <div className="table-container">
                                            {offers.length > 0 ? (
                                                <table className="admin-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Title</th>
                                                            <th>Discount</th>
                                                            <th>Code</th>
                                                            <th>Description</th>
                                                            <th>Valid Till</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {offers.map(offer => (
                                                            <tr key={offer.id}>
                                                                <td><strong>{offer.title}</strong></td>
                                                                <td>
                                                                    <span className="discount-badge">{offer.discount}% OFF</span>
                                                                </td>
                                                                <td><span className="promo-code">{offer.code}</span></td>
                                                                <td>{offer.description ? offer.description.substring(0, 80) : 'No description'}{offer.description && offer.description.length > 80 ? '...' : ''}</td>
                                                                <td>{new Date(offer.validTill).toLocaleDateString()}</td>
                                                                <td>
                                                                    <button
                                                                        className="delete-btn"
                                                                        onClick={() => handleDeleteOffer(offer.id)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="no-data">No offers yet. Create your first offer!</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            }

                            {/* Quotes/Contacts Tab */}
                            {
                                activeTab === 'contacts' && (
                                    <div className="admin-section">
                                        <h1>Contact Messages</h1>

                                        <div className="data-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Subject</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {contacts.map(contact => (
                                                        <tr key={contact.id}>
                                                            <td>{contact.contactName}</td>
                                                            <td>{contact.contactEmail}</td>
                                                            <td>{contact.contactSubject}</td>
                                                            <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                                                            <td><span className="status-new">{contact.status}</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Tours Tab */}
                            {
                                activeTab === 'tours' && (
                                    <div className="admin-section">
                                        <div className="section-header">
                                            <h1>Manage Tour Packages</h1>
                                            <button className="add-btn" onClick={() => setShowAddTourModal(true)}>
                                                <i className="fas fa-plus"></i> Add Package
                                            </button>
                                        </div>
                                        <div className="table-container">
                                            {tours.length > 0 ? (
                                                <table className="admin-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Package Name</th>
                                                            <th>Duration</th>
                                                            <th>Price</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tours.map(tour => (
                                                            <tr key={tour.id}>
                                                                <td><strong>{tour.title}</strong></td>
                                                                <td>{tour.duration}</td>
                                                                <td>₹{tour.price}</td>
                                                                <td>
                                                                    <button
                                                                        className="delete-btn"
                                                                        onClick={() => handleDeleteTour(tour.id)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="no-data">No tour packages yet.</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )}
                </main >
            </div >

            {/* Add Car Modal */}
            {
                showAddCarModal && (
                    <div className="modal-overlay" onClick={() => setShowAddCarModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{vehicleTypeChoice ? `Add New ${vehicleTypeChoice === 'bike' ? 'Bike' : 'Vehicle'}` : 'Add New Vehicle'}</h2>
                                <button className="close-btn" onClick={() => setShowAddCarModal(false)}>×</button>
                            </div>

                            {!vehicleTypeChoice ? (
                                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', padding: '40px 0' }}>
                                    <button
                                        onClick={() => { setVehicleTypeChoice('car'); setCarForm({ ...carForm, category: '' }); }}
                                        style={{
                                            padding: '30px 50px',
                                            fontSize: '1.2rem',
                                            background: '#f8f9fa',
                                            border: '2px solid #ddd',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '15px',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = 'inherit'; }}
                                    >
                                        <i className="fas fa-car" style={{ fontSize: '2.5rem' }}></i>
                                        <span>Add Car</span>
                                    </button>
                                    <button
                                        onClick={() => { setVehicleTypeChoice('bike'); setCarForm({ ...carForm, category: 'Bike', doors: 0, seats: 2 }); }}
                                        style={{
                                            padding: '30px 50px',
                                            fontSize: '1.2rem',
                                            background: '#f8f9fa',
                                            border: '2px solid #ddd',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '15px',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = 'inherit'; }}
                                    >
                                        <i className="fas fa-motorcycle" style={{ fontSize: '2.5rem' }}></i>
                                        <span>Add Bike</span>
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleAddCar} className="admin-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Vehicle Name *</label>
                                            <input
                                                type="text"
                                                value={carForm.name}
                                                onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Category *</label>
                                            <select
                                                value={carForm.category}
                                                onChange={(e) => setCarForm({ ...carForm, category: e.target.value })}
                                                required
                                                disabled={vehicleTypeChoice === 'bike'}
                                            >
                                                {vehicleTypeChoice === 'bike' ? (
                                                    <option value="Bike">Bike</option>
                                                ) : (
                                                    <>
                                                        <option value="">Select Category</option>
                                                        <option value="Sedan">Sedan</option>
                                                        <option value="SUV">SUV</option>
                                                        <option value="Tempo Traveller">Tempo Traveller</option>
                                                        <option value="Bus">Bus</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Price per Day (₹) *</label>
                                            <input
                                                type="number"
                                                value={carForm.price}
                                                onChange={(e) => setCarForm({ ...carForm, price: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Seats *</label>
                                            <input
                                                type="number"
                                                value={carForm.seats}
                                                onChange={(e) => setCarForm({ ...carForm, seats: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        {vehicleTypeChoice !== 'bike' && (
                                            <div className="form-group">
                                                <label>Doors *</label>
                                                <input
                                                    type="number"
                                                    value={carForm.doors}
                                                    onChange={(e) => setCarForm({ ...carForm, doors: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label>Transmission *</label>
                                            <select
                                                value={carForm.transmission}
                                                onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}
                                                required
                                            >
                                                <option value="">Select</option>
                                                <option value="Manual">Manual</option>
                                                <option value="Automatic">Automatic</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Image URL</label>
                                        <input
                                            type="text"
                                            value={carForm.image}
                                            onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                                            placeholder="/images/car.jpg"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            value={carForm.description}
                                            onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="btn-secondary" onClick={() => setVehicleTypeChoice(null)}>
                                            Back
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            Add {vehicleTypeChoice === 'bike' ? 'Bike' : 'Vehicle'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Edit Car Modal */}
            {
                showEditCarModal && (
                    <div className="modal-overlay" onClick={() => setShowEditCarModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Edit Car</h2>
                                <button className="close-btn" onClick={() => setShowEditCarModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleUpdateCar} className="admin-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Car Name *</label>
                                        <input
                                            type="text"
                                            value={carForm.name}
                                            onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select
                                            value={carForm.category}
                                            onChange={(e) => setCarForm({ ...carForm, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Sedan">Sedan</option>
                                            <option value="SUV">SUV</option>
                                            <option value="Tempo Traveller">Tempo Traveller</option>
                                            <option value="Bus">Bus</option>
                                            <option value="Bike">Bike</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price per Day (₹) *</label>
                                        <input
                                            type="number"
                                            value={carForm.price}
                                            onChange={(e) => setCarForm({ ...carForm, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Seats *</label>
                                        <input
                                            type="number"
                                            value={carForm.seats}
                                            onChange={(e) => setCarForm({ ...carForm, seats: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Doors *</label>
                                        <input
                                            type="number"
                                            value={carForm.doors}
                                            onChange={(e) => setCarForm({ ...carForm, doors: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Transmission *</label>
                                        <select
                                            value={carForm.transmission}
                                            onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="Manual">Manual</option>
                                            <option value="Automatic">Automatic</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        value={carForm.image}
                                        onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                                        placeholder="/images/car.jpg"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={carForm.description}
                                        onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowEditCarModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Update Car
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Add Review Modal */}
            {
                showAddReviewModal && (
                    <div className="modal-overlay" onClick={() => setShowAddReviewModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add Review</h2>
                                <button className="close-btn" onClick={() => setShowAddReviewModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleAddReview} className="admin-form">
                                <div className="form-group">
                                    <label>User Name *</label>
                                    <input
                                        type="text"
                                        value={reviewForm.userName}
                                        onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>User Email *</label>
                                    <input
                                        type="email"
                                        value={reviewForm.userEmail}
                                        onChange={(e) => setReviewForm({ ...reviewForm, userEmail: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rating *</label>
                                    <select
                                        value={reviewForm.rating}
                                        onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                                        required
                                    >
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Comment *</label>
                                    <textarea
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowAddReviewModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Add Review
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Add Offer Modal */}
            {
                showAddOfferModal && (
                    <div className="modal-overlay" onClick={() => setShowAddOfferModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add Special Offer</h2>
                                <button className="close-btn" onClick={() => setShowAddOfferModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleAddOffer} className="admin-form">
                                <div className="form-group">
                                    <label>Offer Title *</label>
                                    <input
                                        type="text"
                                        value={offerForm.title}
                                        onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        value={offerForm.description}
                                        onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Discount (%) *</label>
                                        <input
                                            type="number"
                                            value={offerForm.discount}
                                            onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Promo Code</label>
                                        <input
                                            type="text"
                                            value={offerForm.code}
                                            onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value })}
                                            placeholder="SAVE20"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Valid Till *</label>
                                    <input
                                        type="date"
                                        value={offerForm.validTill}
                                        onChange={(e) => setOfferForm({ ...offerForm, validTill: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowAddOfferModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Add Offer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Make Admin Modal */}
            {
                showMakeAdminModal && (
                    <div className="modal-overlay" onClick={() => setShowMakeAdminModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Grant Admin Access</h2>
                                <button className="close-btn" onClick={() => setShowMakeAdminModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleMakeAdmin} className="admin-form">
                                <div className="form-group">
                                    <label>User Email (for reference)</label>
                                    <input
                                        type="email"
                                        value={adminForm.userEmail}
                                        onChange={(e) => setAdminForm({ ...adminForm, userEmail: e.target.value })}
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>User UID *</label>
                                    <input
                                        type="text"
                                        value={adminForm.uid}
                                        onChange={(e) => setAdminForm({ ...adminForm, uid: e.target.value })}
                                        placeholder="Copy UID from users table above"
                                        required
                                    />
                                    <small>Copy the UID from the users table above</small>
                                </div>
                                <div className="warning-box">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    <p>Warning: This will grant full admin access to the user. They will be able to manage all data and make other users admin.</p>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowMakeAdminModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Grant Admin Access
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {/* Add Tour Modal */}
            {
                showAddTourModal && (
                    <div className="modal-overlay" onClick={() => setShowAddTourModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add Tour Package</h2>
                                <button className="close-btn" onClick={() => setShowAddTourModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleAddTour} className="admin-form">
                                <div className="form-group">
                                    <label>Package Title *</label>
                                    <input
                                        type="text"
                                        value={tourForm.title}
                                        onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Duration *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 3 Days / 2 Nights"
                                            value={tourForm.duration}
                                            onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price (₹) *</label>
                                        <input
                                            type="number"
                                            value={tourForm.price}
                                            onChange={(e) => setTourForm({ ...tourForm, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        value={tourForm.image}
                                        onChange={(e) => setTourForm({ ...tourForm, image: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        value={tourForm.description}
                                        onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Features (comma separated)</label>
                                    <textarea
                                        value={tourForm.features}
                                        onChange={(e) => setTourForm({ ...tourForm, features: e.target.value })}
                                        rows="2"
                                        placeholder="Hotel Stay, Sightseeing, Meals, Transport"
                                    ></textarea>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowAddTourModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Add Package
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminDashboard;
