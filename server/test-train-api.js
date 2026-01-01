const axios = require('axios');

const RAPIDAPI_KEY = 'fe7f6e9a6cmsh7c51381d5f1e197p1647d4jsn9aad525b488f';
const RAPIDAPI_HOST = 'indian-railway-irctc.p.rapidapi.com';

const testTrainSearch = async () => {
    try {
        console.log("Testing API with key:", RAPIDAPI_KEY);
        const options = {
            method: 'GET',
            // Trying v1 or v2 commonly found
            url: `https://${RAPIDAPI_HOST}/api/v2/trainBetweenStations`,
            params: {
                from: 'NDLS',
                to: 'CNB',
                date: '2025-01-20' // Future date
            },
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);
        console.log("Response status:", response.status);
        console.log("Response data:", JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error("API Error details:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

testTrainSearch();
