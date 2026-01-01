const axios = require('axios');

const RAPIDAPI_KEY = 'fe7f6e9a6cmsh7c51381d5f1e197p1647d4jsn9aad525b488f';
const RAPIDAPI_HOST = 'airplanes.p.rapidapi.com';

const testAirplaneApi = async () => {
    try {
        console.log("Testing Aircraft API...");
        const options = {
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/random_aircraft`,
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);
        console.log("Success!");
        console.log("Data:", JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error("Airport API Error:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

testAirplaneApi();
