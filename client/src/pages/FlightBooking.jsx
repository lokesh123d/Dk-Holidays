import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages/FlightBooking.css';

const FlightBooking = () => {
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        departDate: '',
        returnDate: '',
        passengers: 1,
        tripType: 'one-way'
    });

    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);

    // Sample flight data
    const sampleFlights = [
        {
            id: 1,
            airline: 'Air India',
            flightNumber: 'AI-101',
            from: 'Delhi',
            to: 'Mumbai',
            departure: '06:00 AM',
            arrival: '08:30 AM',
            duration: '2h 30m',
            price: 4500,
            seats: 12
        },
        {
            id: 2,
            airline: 'IndiGo',
            flightNumber: '6E-201',
            from: 'Delhi',
            to: 'Mumbai',
            departure: '09:30 AM',
            arrival: '12:00 PM',
            duration: '2h 30m',
            price: 3800,
            seats: 8
        },
        {
            id: 3,
            airline: 'SpiceJet',
            flightNumber: 'SG-301',
            from: 'Mumbai',
            to: 'Bangalore',
            departure: '11:00 AM',
            arrival: '01:30 PM',
            duration: '1h 30m',
            price: 3200,
            seats: 15
        },
        {
            id: 4,
            airline: 'Vistara',
            flightNumber: 'UK-401',
            from: 'Delhi',
            to: 'Bangalore',
            departure: '02:00 PM',
            arrival: '05:00 PM',
            duration: '3h 0m',
            price: 5200,
            seats: 6
        },
        {
            id: 5,
            airline: 'Air India',
            flightNumber: 'AI-501',
            from: 'Mumbai',
            to: 'Delhi',
            departure: '05:30 PM',
            arrival: '08:00 PM',
            duration: '2h 30m',
            price: 4800,
            seats: 10
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

        // Simulate API call
        setTimeout(() => {
            const results = sampleFlights.filter(flight =>
                flight.from.toLowerCase().includes(searchData.from.toLowerCase()) &&
                flight.to.toLowerCase().includes(searchData.to.toLowerCase())
            );

            setSearchResults(results);
            setSearching(false);
            setSearched(true);
        }, 1000);
    };

    const handleBooking = (flight) => {
        alert(`Booking ${flight.airline} flight ${flight.flightNumber} for ${searchData.passengers} passenger(s).\nPrice: ₹${flight.price * searchData.passengers}\n\nPlease contact us to complete your booking!`);
    };

    return (
        <div className="flight-booking-page">
            <Navbar />

            {/* Hero Section */}
            <section className="flight-hero">
                <div className="container">
                    <h1>Book Your Flight</h1>
                    <p>Find and book the best flights at competitive prices</p>
                </div>
            </section>

            {/* Search Form */}
            <section className="search-section">
                <div className="container">
                    <form className="flight-search-form" onSubmit={handleSearch}>
                        <div className="trip-type">
                            <label>
                                <input
                                    type="radio"
                                    name="tripType"
                                    value="one-way"
                                    checked={searchData.tripType === 'one-way'}
                                    onChange={handleInputChange}
                                />
                                One Way
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="tripType"
                                    value="round-trip"
                                    checked={searchData.tripType === 'round-trip'}
                                    onChange={handleInputChange}
                                />
                                Round Trip
                            </label>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>From</label>
                                <input
                                    type="text"
                                    name="from"
                                    value={searchData.from}
                                    onChange={handleInputChange}
                                    placeholder="Delhi, Mumbai, Bangalore..."
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
                                    placeholder="Delhi, Mumbai, Bangalore..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Departure Date</label>
                                <input
                                    type="date"
                                    name="departDate"
                                    value={searchData.departDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            {searchData.tripType === 'round-trip' && (
                                <div className="form-group">
                                    <label>Return Date</label>
                                    <input
                                        type="date"
                                        name="returnDate"
                                        value={searchData.returnDate}
                                        onChange={handleInputChange}
                                        min={searchData.departDate}
                                    />
                                </div>
                            )}

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
                            {searching ? 'Searching...' : 'Search Flights'}
                        </button>
                    </form>
                </div>
            </section>

            {/* Search Results */}
            {searched && (
                <section className="results-section">
                    <div className="container">
                        <h2>Available Flights</h2>

                        {searchResults.length > 0 ? (
                            <div className="flights-list">
                                {searchResults.map(flight => (
                                    <div key={flight.id} className="flight-card">
                                        <div className="flight-info">
                                            <div className="airline">
                                                <h3>{flight.airline}</h3>
                                                <p>{flight.flightNumber}</p>
                                            </div>

                                            <div className="route">
                                                <div className="departure">
                                                    <h4>{flight.from}</h4>
                                                    <p className="time">{flight.departure}</p>
                                                </div>

                                                <div className="duration">
                                                    <p>{flight.duration}</p>
                                                    <div className="line"></div>
                                                </div>

                                                <div className="arrival">
                                                    <h4>{flight.to}</h4>
                                                    <p className="time">{flight.arrival}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flight-price">
                                            <p className="seats">{flight.seats} seats left</p>
                                            <h3>₹{flight.price}</h3>
                                            <p>per person</p>
                                            <button
                                                className="book-btn"
                                                onClick={() => handleBooking(flight)}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                <p>No flights found for your search. Please try different cities.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};

export default FlightBooking;
