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
app.get('/', (req, res) => {
    res.send('API Running...');
});

// @route   POST /visitor
// @desc    Create a new visitor
app.post('/visitor', async (req, res) => {
    try {
        const { name, phone, vehicle, flatNumber, isPriority, entryTime, gate } = req.body;

        const newVisitor = new Visitor({
            name,
            phone,
            vehicle,
            flatNumber,
            isPriority,
            entryTime: entryTime || new Date(),
            gate
        });

        const visitor = await newVisitor.save();
        res.status(201).json(visitor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
