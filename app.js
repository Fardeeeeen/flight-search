const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    },
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/search', async (req, res) => {
    const { origin, destination, cabin } = req.body;

    const headers = {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,hi;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    };

    const json_data = {
        'origin': origin,
        'destination': destination,
        'partnerPrograms': [
            'Air Canada',
            'United Airlines',
            'KLM',
            'Qantas',
            'American Airlines',
            'Etihad Airways',
            'Alaska Airlines',
            'Qatar Airways',
            'LifeMiles',
        ],
        'stops': 2,
        'departureTimeFrom': '2024-07-09T00:00:00Z',
        'departureTimeTo': '2024-10-07T00:00:00Z',
        'isOldData': false,
        'limit': 302,
        'offset': 0,
        'cabinSelection': [
            cabin,
        ],
        'date': '2024-07-09T12:00:17.796Z',
    };

    try {
        const response = await axios.post('https://cardgpt.in/apitest', json_data, { headers });
        console.log('API Response:', response.data); // Log the API response
        res.json(response.data.data || []);
    } catch (error) {
        console.error('API Error:', error); // Log any errors
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
