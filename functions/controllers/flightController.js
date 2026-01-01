const axios = require('axios');

// Amadeus API Configuration
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
let amadeusAccessToken = null;
let tokenExpiry = null;

// Helper to get Amadeus Access Token
const getAmadeusToken = async () => {
    try {
        if (amadeusAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
            return amadeusAccessToken;
        }

        const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',
            new URLSearchParams({
                'grant_type': 'client_credentials',
                'client_id': AMADEUS_CLIENT_ID,
                'client_secret': AMADEUS_CLIENT_SECRET
            }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
        );

        amadeusAccessToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Expire 1 min early
        return amadeusAccessToken;
    } catch (error) {
        console.error('Error getting Amadeus token:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Amadeus API');
    }
};

// Search flights using Amadeus API
const searchFlights = async (req, res) => {
    try {
        const {
            from, // IATA code
            to,   // IATA code
            departDate,
            returnDate,
            adults = 1,
            tripType = 'one-way'
        } = req.body;

        // Validation
        if (!from || !to || !departDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: from, to, departDate'
            });
        }

        const token = await getAmadeusToken();
        const url = 'https://test.api.amadeus.com/v2/shopping/flight-offers';

        const params = {
            originLocationCode: from,
            destinationLocationCode: to,
            departureDate: departDate,
            adults: adults,
            currencyCode: 'INR',
            max: 20
        };

        if (tripType === 'round-trip' && returnDate) {
            params.returnDate = returnDate;
        }

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            params: params
        });

        // Transform Amadeus response to simpler format for frontend
        const flights = response.data.data.map(offer => ({
            id: offer.id,
            airline: offer.validatingAirlineCodes[0], // Simplified
            flightNumber: `${offer.itineraries[0].segments[0].carrierCode}-${offer.itineraries[0].segments[0].number}`,
            from: offer.itineraries[0].segments[0].departure.iataCode,
            to: offer.itineraries[0].segments[0].arrival.iataCode,
            departure: offer.itineraries[0].segments[0].departure.at,
            arrival: offer.itineraries[0].segments[0].arrival.at,
            duration: offer.itineraries[0].duration,
            price: offer.price.total,
            currency: offer.price.currency,
            seats: offer.numberOfBookableSeats,
            rawData: offer // Keep full data if needed later
        }));

        res.json({
            success: true,
            count: flights.length,
            data: flights
        });

    } catch (error) {
        console.log('Amadeus API unavailable. Switching to Mock Data.');

        // Mock Data for Fallback
        const mockFlights = [
            {
                id: 'AI-101',
                airline: 'Air India',
                flightNumber: 'AI-101',
                from: req.body.from,
                to: req.body.to,
                departure: '08:00',
                arrival: '10:30',
                duration: 'PT2H30M',
                price: '4500.00',
                currency: 'INR',
                seats: 9
            },
            {
                id: '6E-304',
                airline: 'IndiGo',
                flightNumber: '6E-304',
                from: req.body.from,
                to: req.body.to,
                departure: '14:00',
                arrival: '16:15',
                duration: 'PT2H15M',
                price: '3800.00',
                currency: 'INR',
                seats: 5
            }
        ];

        res.json({
            success: true,
            count: mockFlights.length,
            data: mockFlights,
            message: 'Showing demo results (Amadeus credentials invalid)',
            isMock: true
        });
    }
};

// Placeholder for booking options / details
const getBookingOptions = async (req, res) => {
    // This would typically validate prices or create a flight order in Amadeus
    res.json({
        success: true,
        message: "Booking options retrieved"
    });
};

module.exports = {
    searchFlights,
    getBookingOptions
};
