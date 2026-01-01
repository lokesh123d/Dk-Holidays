const axios = require('axios');

// RapidAPI Configuration
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'fe7f6e9a6cmsh7c51381d5f1e197p1647d4jsn9aad525b488f';
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'indian-railway-irctc.p.rapidapi.com';

// Helper to map city names to station codes
const getStationCode = (city) => {
    const cityMap = {
        'delhi': 'NDLS',
        'new delhi': 'NDLS',
        'mumbai': 'CSMT',
        'bangalore': 'SBC',
        'bengaluru': 'SBC',
        'kolkata': 'HWH',
        'howrah': 'HWH',
        'chennai': 'MAS',
        'hyderabad': 'SC',
        'secunderabad': 'SC',
        'pune': 'PUNE',
        'ahmedabad': 'ADI',
        'jaipur': 'JP',
        'dharamshala': 'CHB', // Nearest broad gauge is Pathankot/Chakki Bank usually, but generic mapping
        'pathankot': 'PTK'
    };
    return cityMap[city.toLowerCase()] || city.toUpperCase();
};

// Search trains using RapidAPI
const searchTrains = async (req, res) => {
    try {
        const {
            from, // City Name or Station Code
            to,   // City Name or Station Code
            date  // YYYY-MM-DD
        } = req.body;

        if (!from || !to || !date) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: from, to, date'
            });
        }

        const fromCode = getStationCode(from);
        const toCode = getStationCode(to);

        // API supports: GET /api/v2/trainBetweenStations
        // Query params: from, to, date
        const options = {
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/api/v2/trainBetweenStations`,
            params: {
                from: fromCode,
                to: toCode,
                date: date
            },
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);
        const data = response.data;

        // Note: The structure of data.data depends on the specific API version.
        // Usually it returns a list of trains.

        if (!data || (data.status && data.status === false)) {
            // If API returns logical error (e.g., no trains found)
            console.log("API returned no data or error status:", data);
            return res.json({
                success: true,
                count: 0,
                data: [],
                message: data.message || "No trains found"
            });
        }

        let trainList = [];
        if (Array.isArray(data)) {
            trainList = data;
        } else if (data.data && Array.isArray(data.data)) {
            trainList = data.data;
        } else if (data.trains && Array.isArray(data.trains)) {
            trainList = data.trains;
        }

        // Transform response to match frontend expectation
        const trains = trainList.map(train => ({
            id: train.train_number || train.trainNumber,
            name: train.train_name || train.trainName || "Express",
            trainNumber: train.train_number || train.trainNumber,
            from: train.from_sta || train.fromStnCode || fromCode,
            to: train.to_sta || train.toStnCode || toCode,
            departure: train.from_std || train.departureTime || "00:00",
            arrival: train.to_sta_std || train.arrivalTime || "00:00",
            duration: train.duration || "N/A",
            classes: {
                // Mock prices if not provided by this endpoint
                sleeper: 450,
                ac3: 1200,
                ac2: 1800,
                ac1: 3000
            },
            seats: 50 // Mock availability
        }));

        res.json({
            success: true,
            count: trains.length,
            data: trains
        });

    } catch (error) {
        console.log('Train Search API unreachable/unsubscribed. Switching to Mock Data.');

        // Mock Data for Fallback
        const mockTrains = [
            {
                id: '12301',
                name: 'Rajdhani Express (Demo)',
                trainNumber: '12301',
                from: req.body.from,
                to: req.body.to,
                departure: '17:00',
                arrival: '10:00',
                duration: '17h 00m',
                classes: { sleeper: 800, ac3: 1500, ac2: 2400 },
                seats: 45
            },
            {
                id: '12004',
                name: 'Shatabdi Express (Demo)',
                trainNumber: '12004',
                from: req.body.from,
                to: req.body.to,
                departure: '06:00',
                arrival: '12:00',
                duration: '06h 00m',
                classes: { ac2: 1200, ac1: 2000 },
                seats: 30
            }
        ];

        res.json({
            success: true,
            count: mockTrains.length,
            data: mockTrains,
            message: 'Showing demo results (API subscription required)',
            isMock: true
        });
    }
};

module.exports = {
    searchTrains
};
