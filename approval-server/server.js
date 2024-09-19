const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001;
const DATA_FILE = 'requests.json';

app.use(bodyParser.json());
app.use(cors());

let requests = [];

// Load requests from JSON file
const loadRequests = () => {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE);
        requests = JSON.parse(data);
    }
};

// Save requests to JSON file
const saveRequests = () => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2));
};

loadRequests();

app.get('/api/requests', (req, res) => {
    res.json(requests);
});

app.post('/api/requests/:id/approve', (req, res) => {
    const { id } = req.params;
    const request = requests.find(r => r.id === parseInt(id));
    if (request) {
        request.status = 'Approved';
        saveRequests();
        res.json({ message: 'Request approved' });
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
