const axios = require('axios');

// SerpApi Google Flights search
const searchFlights = async (req, res) => {
    try {
        const {
            departureId,
            arrivalId,
            outboundDate,
            returnDate,
            adults = 1,
            currency = 'INR',
            type = 1 // 1 = Round trip, 2 = One way
        } = req.body;

        // Validate required parameters
        if (!departureId || !arrivalId || !outboundDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: departureId, arrivalId, outboundDate'
            });
        }

        // SerpApi API Key
        const API_KEY = process.env.SERPAPI_KEY || 'your_serpapi_key_here';

        // Build API parameters
        const params = {
            engine: 'google_flights',
            departure_id: departureId,
            arrival_id: arrivalId,
            outbound_date: outboundDate,
            currency: currency,
            hl: 'en',
            gl: 'in',
            adults: adults,
            type: type,
            api_key: API_KEY
        };

        // Add return date for round trip
        if (type === 1 && returnDate) {
            params.return_date = returnDate;
        }

        // Make request to SerpApi
        const response = await axios.get('https://serpapi.com/search', { params });

        const flightsData = response.data;

        // Extract and format flight results
        const formattedResults = {
            success: true,
            searchParameters: flightsData.search_parameters,
            bestFlights: flightsData.best_flights || [],
            otherFlights: flightsData.other_flights || [],
            priceInsights: flightsData.price_insights || null,
            airports: flightsData.airports || []
        };

        res.json(formattedResults);

    } catch (error) {
        console.error('Error searching flights:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Error searching flights',
            error: error.response?.data || error.message
        });
    }
};

// Get flight booking options
const getBookingOptions = async (req, res) => {
    try {
        const { bookingToken } = req.body;

        if (!bookingToken) {
            return res.status(400).json({
                success: false,
                message: 'Missing booking_token'
            });
        }

        const API_KEY = process.env.SERPAPI_KEY || 'your_serpapi_key_here';

        const params = {
            engine: 'google_flights',
            booking_token: bookingToken,
            api_key: API_KEY
        };

        const response = await axios.get('https://serpapi.com/search', { params });

        res.json({
            success: true,
            bookingOptions: response.data
        });

    } catch (error) {
        console.error('Error getting booking options:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Error getting booking options',
            error: error.response?.data || error.message
        });
    }
};

module.exports = {
    searchFlights,
    getBookingOptions
};
