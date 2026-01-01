import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages/TicketBooking.css';
import { useAuth } from '../utils/AuthContext';

const TicketBooking = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('flight'); // 'flight' or 'train'

    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        date: '',
        passengers: 1,
        class: 'economy' // for flight: economy/business, for train: SL/3A/2A/1A
    });
    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleWhatsAppInquiry();
    };

    const handleWhatsAppInquiry = () => {
        const message = `*${activeTab.toUpperCase()} Booking Request*%0A%0A` +
            `*From:* ${searchData.from}%0A` +
            `*To:* ${searchData.to}%0A` +
            `*Date:* ${searchData.date}%0A` +
            `*Passengers:* ${searchData.passengers}%0A` +
            `*Class:* ${searchData.class}%0A%0A` +
            `Please book this ticket for me.`;

        window.open(`https://wa.me/918626877277?text=${message}`, '_blank');
    };

    return (
        <div className="ticket-booking-page">
            <Navbar />

            <div className="ticket-hero">
                <div className="container">
                    <h1>Ticket Booking Services</h1>
                    <p>Book Flight & Train Tickets directly via WhatsApp</p>
                </div>
            </div>

            <div className="ticket-container">
                <div className="ticket-tabs">
                    <div
                        className={`ticket-tab ${activeTab === 'flight' ? 'active' : ''}`}
                        onClick={() => setActiveTab('flight')}
                    >
                        <i className="fas fa-plane"></i> Flight Booking
                    </div>
                    <div
                        className={`ticket-tab ${activeTab === 'train' ? 'active' : ''}`}
                        onClick={() => setActiveTab('train')}
                    >
                        <i className="fas fa-train"></i> Train Booking
                    </div>
                </div>

                <div className="ticket-form-section">
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>From</label>
                                <input
                                    type="text"
                                    placeholder="City or Station"
                                    value={searchData.from}
                                    onChange={e => setSearchData({ ...searchData, from: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>To</label>
                                <input
                                    type="text"
                                    placeholder="City or Station"
                                    value={searchData.to}
                                    onChange={e => setSearchData({ ...searchData, to: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Journey Date</label>
                                <input
                                    type="date"
                                    value={searchData.date}
                                    onChange={e => setSearchData({ ...searchData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Passengers</label>
                                <select
                                    value={searchData.passengers}
                                    onChange={e => setSearchData({ ...searchData, passengers: e.target.value })}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Class</label>
                                <select
                                    value={searchData.class}
                                    onChange={e => setSearchData({ ...searchData, class: e.target.value })}
                                >
                                    {activeTab === 'flight' ? (
                                        <>
                                            <option value="economy">Economy</option>
                                            <option value="business">Business</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="SL">Sleeper (SL)</option>
                                            <option value="3A">AC 3 Tier (3A)</option>
                                            <option value="2A">AC 2 Tier (2A)</option>
                                            <option value="1A">AC First Class (1A)</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="search-btn" style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}>
                            <i className="fab fa-whatsapp"></i> Send Booking Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketBooking;
