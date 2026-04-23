const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Visitor = require('./models/Visitor');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
    res.send('API Running...');
});

// @route   POST /visitor
// @desc    Create a new visitor
app.post('/visitor', async (req, res) => {
    try {
        // Create a new visitor from the request body data
        const visitor = await Visitor.create(req.body);
        
        // Return the created visitor object
        res.status(201).json(visitor);
    } catch (err) {
        // Return status 500 with the error message
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
