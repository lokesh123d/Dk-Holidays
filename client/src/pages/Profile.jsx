import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import '../styles/pages/Profile.css';

const Profile = () => {
    const { currentUser, isAdmin } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: currentUser?.displayName || '',
        email: currentUser?.email || '',
        phone: currentUser?.phoneNumber || '',
        address: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        // TODO: Implement profile update logic
        toast.success('Profile updated successfully!');
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setFormData({
            displayName: currentUser?.displayName || '',
            email: currentUser?.email || '',
            phone: currentUser?.phoneNumber || '',
            address: ''
        });
        setIsEditing(false);
    };

    if (!currentUser) {
        return (
            <div>
                <Navbar />
                <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                    <h2>Please login to view your profile</h2>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="profile-page">
                <div className="container">
                    <div className="profile-container">
                        {/* Profile Header */}
                        <div className="profile-header">
                            <div className="profile-avatar-section">
                                <div className="profile-avatar-wrapper">
                                    <img
                                        src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email)}&size=200&background=random&color=fff`}
                                        alt="Profile"
                                        className="profile-avatar"
                                    />
                                    <button className="change-photo-btn" title="Change Photo">
                                        <i className="fas fa-camera"></i>
                                    </button>
                                </div>
                                <div className="profile-header-info">
                                    <h1>{currentUser.displayName || 'User'}</h1>
                                    <p className="profile-email">
                                        <i className="fas fa-envelope"></i> {currentUser.email}
                                    </p>
                                    {isAdmin && (
                                        <span className="admin-badge">
                                            <i className="fas fa-user-shield"></i> Admin
                                        </span>
                                    )}
                                </div>
                            </div>
                            {!isEditing && (
                                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                                    <i className="fas fa-edit"></i> Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Profile Content */}
                        <div className="profile-content">
                            {/* Personal Information Card */}
                            <div className="profile-card">
                                <div className="card-header">
                                    <h2>
                                        <i className="fas fa-user"></i> Personal Information
                                    </h2>
                                </div>
                                <div className="card-body">
                                    {isEditing ? (
                                        <form onSubmit={handleSaveProfile} className="profile-form">
                                            <div className="form-group">
                                                <label>
                                                    <i className="fas fa-user"></i> Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="displayName"
                                                    value={formData.displayName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>
                                                    <i className="fas fa-envelope"></i> Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    disabled
                                                    className="disabled-input"
                                                />
                                                <small>Email cannot be changed</small>
                                            </div>
                                            <div className="form-group">
                                                <label>
                                                    <i className="fas fa-phone"></i> Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>
                                                    <i className="fas fa-map-marker-alt"></i> Address
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your address"
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="form-actions">
                                                <button type="submit" className="save-btn">
                                                    <i className="fas fa-check"></i> Save Changes
                                                </button>
                                                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                                                    <i className="fas fa-times"></i> Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="profile-info-grid">
                                            <div className="info-item">
                                                <i className="fas fa-user info-icon"></i>
                                                <div>
                                                    <label>Full Name</label>
                                                    <p>{formData.displayName || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <i className="fas fa-envelope info-icon"></i>
                                                <div>
                                                    <label>Email</label>
                                                    <p>{currentUser.email}</p>
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <i className="fas fa-phone info-icon"></i>
                                                <div>
                                                    <label>Phone</label>
                                                    <p>{formData.phone || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <i className="fas fa-map-marker-alt info-icon"></i>
                                                <div>
                                                    <label>Address</label>
                                                    <p>{formData.address || 'Not provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Stats Card */}
                            <div className="profile-card">
                                <div className="card-header">
                                    <h2>
                                        <i className="fas fa-chart-line"></i> Account Statistics
                                    </h2>
                                </div>
                                <div className="card-body">
                                    <div className="stats-grid">
                                        <div className="stat-box">
                                            <i className="fas fa-calendar-check stat-icon"></i>
                                            <h3>5</h3>
                                            <p>Total Bookings</p>
                                        </div>
                                        <div className="stat-box">
                                            <i className="fas fa-clock stat-icon"></i>
                                            <p className="stat-date">
                                                Member since<br />
                                                {currentUser.metadata?.creationTime ?
                                                    new Date(currentUser.metadata.creationTime).toLocaleDateString() :
                                                    'Unknown'}
                                            </p>
                                        </div>
                                        <div className="stat-box">
                                            <i className="fas fa-heart stat-icon"></i>
                                            <h3>3</h3>
                                            <p>Favorite Cars</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="profile-card">
                                <div className="card-header">
                                    <h2>
                                        <i className="fas fa-bolt"></i> Quick Actions
                                    </h2>
                                </div>
                                <div className="card-body">
                                    <div className="quick-actions">
                                        <a href="/my-bookings" className="action-btn">
                                            <i className="fas fa-calendar"></i>
                                            <span>View Bookings</span>
                                        </a>
                                        <a href="/" className="action-btn">
                                            <i className="fas fa-car"></i>
                                            <span>Browse Cars</span>
                                        </a>
                                        <a href="/contact" className="action-btn">
                                            <i className="fas fa-headset"></i>
                                            <span>Contact Support</span>
                                        </a>
                                        <button className="action-btn danger" onClick={() => {
                                            if (window.confirm('Are you sure you want to delete your account?')) {
                                                toast.error('Account deletion will be available soon');
                                            }
                                        }}>
                                            <i className="fas fa-trash"></i>
                                            <span>Delete Account</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
