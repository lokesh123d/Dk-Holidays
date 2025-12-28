import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages/TrainBooking.css';
import { useAuth } from '../utils/AuthContext';
import BookingModal from '../components/BookingModal';

const TrainBooking = () => {
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        date: '',
        passengers: 1,
        class: 'sleeper'
    });

    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const { currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrain, setSelectedTrain] = useState(null);

    // Sample train data
    const sampleTrains = [
        {
            id: 1,
            name: 'Rajdhani Express',
            trainNumber: '12301',
            from: 'New Delhi',
            to: 'Howrah',
            departure: '17:00',
            arrival: '10:00 +1',
            duration: '17h 0m',
            classes: {
                sleeper: 800,
                ac3: 1500,
                ac2: 2200,
                ac1: 3500
            },
            seats: 45
        },
        {
            id: 2,
            name: 'Shatabdi Express',
            trainNumber: '12002',
            from: 'New Delhi',
            to: 'Kalka',
            departure: '07:40',
            arrival: '12:10',
            duration: '4h 30m',
            classes: {
                ac2: 1800,
                ac1: 2800
            },
            seats: 28
        },
        {
            id: 3,
            name: 'Duronto Express',
            trainNumber: '12259',
            from: 'New Delhi',
            to: 'Sealdah',
            departure: '16:40',
            arrival: '08:30 +1',
            duration: '15h 50m',
            classes: {
                sleeper: 900,
                ac3: 1650,
                ac2: 2400
            },
            seats: 52
        },
        {
            id: 4,
            name: 'Jan Shatabdi',
            trainNumber: '12056',
            from: 'Hazrat Nizamuddin',
            to: 'Dehradun',
            departure: '06:50',
            arrival: '13:30',
            duration: '6h 40m',
            classes: {
                sleeper: 450,
                ac2: 1200
            },
            seats: 35
        },
        {
            id: 5,
            name: 'Garib Rath',
            trainNumber: '12909',
            from: 'Mumbai Central',
            to: 'Hazrat Nizamuddin',
            departure: '14:55',
            arrival: '05:15 +1',
            duration: '14h 20m',
            classes: {
                sleeper: 650,
                ac3: 1100
            },
            seats: 60
        }
    ];

    const handleInputChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearching(true);

        setTimeout(() => {
            const results = sampleTrains.filter(train =>
                train.from.toLowerCase().includes(searchData.from.toLowerCase()) &&
                train.to.toLowerCase().includes(searchData.to.toLowerCase()) &&
                train.classes[searchData.class] !== undefined
            );

            setSearchResults(results);
            setSearching(false);
            setSearched(true);
        }, 1000);
    };

    const handleBooking = (train) => {
        setSelectedTrain(train);
        setIsModalOpen(true);
    };

    const getClassName = (classKey) => {
        const names = {
            sleeper: 'Sleeper',
            ac3: 'AC 3 Tier',
            ac2: 'AC 2 Tier',
            ac1: 'AC 1 Tier'
        };
        return names[classKey] || classKey;
    };

    return (
        <div className="train-booking-page">
            <Navbar />

            {/* Hero Section */}
            <section className="train-hero">
                <div className="container">
                    <h1>Book Your Train Ticket</h1>
                    <p>Find and book train tickets across India</p>
                </div>
            </section>

            {/* Search Form */}
            <section className="search-section">
                <div className="container">
                    <form className="train-search-form" onSubmit={handleSearch}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>From</label>
                                <input
                                    type="text"
                                    name="from"
                                    value={searchData.from}
                                    onChange={handleInputChange}
                                    placeholder="New Delhi, Mumbai, Kolkata..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>To</label>
                                <input
                                    type="text"
                                    name="to"
                                    value={searchData.to}
                                    onChange={handleInputChange}
                                    placeholder="New Delhi, Mumbai, Kolkata..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Journey Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={searchData.date}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Class</label>
                                <select
                                    name="class"
                                    value={searchData.class}
                                    onChange={handleInputChange}
                                >
                                    <option value="sleeper">Sleeper</option>
                                    <option value="ac3">AC 3 Tier</option>
                                    <option value="ac2">AC 2 Tier</option>
                                    <option value="ac1">AC 1 Tier</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Passengers</label>
                                <select
                                    name="passengers"
                                    value={searchData.passengers}
                                    onChange={handleInputChange}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="search-btn" disabled={searching}>
                            {searching ? 'Searching...' : 'Search Trains'}
                        </button>
                    </form>
                </div>
            </section>

            {/* Search Results */}
            {searched && (
                <section className="results-section">
                    <div className="container">
                        <h2>Available Trains</h2>

                        {searchResults.length > 0 ? (
                            <div className="trains-list">
                                {searchResults.map(train => (
                                    <div key={train.id} className="train-card">
                                        <div className="train-info">
                                            <div className="train-name">
                                                <h3>{train.name}</h3>
                                                <p>{train.trainNumber}</p>
                                            </div>

                                            <div className="route">
                                                <div className="departure">
                                                    <h4>{train.from}</h4>
                                                    <p className="time">{train.departure}</p>
                                                </div>

                                                <div className="duration">
                                                    <p>{train.duration}</p>
                                                    <div className="line"></div>
                                                </div>

                                                <div className="arrival">
                                                    <h4>{train.to}</h4>
                                                    <p className="time">{train.arrival}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="train-price">
                                            <p className="seats">{train.seats} seats available</p>
                                            <p className="class-type">{getClassName(searchData.class)}</p>
                                            <h3>₹{train.classes[searchData.class]}</h3>
                                            <p>per person</p>
                                            <button
                                                className="book-btn"
                                                onClick={() => handleBooking(train)}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                <p>No trains found for your search. Please try different stations or class.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedItem={selectedTrain}
                currentUser={currentUser}
                bookingType="train"
                extraData={{
                    date: searchData.date,
                    passengers: searchData.passengers,
                    class: searchData.class
                }}
            />
        </div>
    );
};

export default TrainBooking;
