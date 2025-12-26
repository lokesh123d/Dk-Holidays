import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages/CarDetails.css';

const CarDetails = () => {
    const { id } = useParams();

    // This would fetch car details from API
    // For now using placeholder

    return (
        <div className="car-details-page">
            <Navbar />
            <div className="container">
                <h1>Car Details - {id}</h1>
                <p>Car details page coming soon...</p>
            </div>
        </div>
    );
};

export default CarDetails;
