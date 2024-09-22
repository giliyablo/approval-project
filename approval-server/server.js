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
    const { comment } = req.body;
    const request = requests.find(r => r.ID === parseInt(id));
    if (request) {
        request.status = 'Approved';
        request.comments = comment; // Save the comment
        saveRequests();
        res.json({ message: 'Request approved' });
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
});

// Endpoint to receive form data
app.post('/api/form-responses', (req, res) => {
    const formData = req.body;
    console.log('Form Data Received:', formData);

    // Extract specific fields from the form data
    const {
        ID,
        'שעת התחלה': startTime,
        'שעת השלמה': endTime,
        'דואר אלקטרוני': email,
        'שם': name,
        'שם פרטי (באנגלית)': firstName,
        'שם משפחה (באנגלית)': lastName,
        'מספר טלפון': phoneNumber,
        'גורם מפנה מענף אגמי"ם לפתיחת המשתמש (קצין מאשר מענף אגמים)': referringOfficer,
        'ארגון': organization,
        // Add other fields as needed
    } = formData;

    // Example of processing the data
    console.log(`ID: ${ID}, Start Time: ${startTime}, End Time: ${endTime}, Email: ${email}, Name: ${name}`);

    // Add the form data to the requests array with default status
    requests.push({ ...formData, status: 'unapproved', comments: '' });
    saveRequests();

    res.status(200).send('Form data received');
});

// Endpoint to update comments
app.post('/api/requests/:id/comment', (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const request = requests.find(r => r.ID === parseInt(id));
    if (request) {
        request.comments = comment;
        saveRequests();
        res.json({ message: 'Comment added' });
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
