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
app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));

app.get('/', (req, res) => {
    res.send('Smart Parking API is Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
