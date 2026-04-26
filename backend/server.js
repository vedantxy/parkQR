require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Enterprise Logging
app.use(morgan('dev'));

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Global IO attachment
app.set('socketio', io);

// Socket Events
io.on('connection', (socket) => {
    console.log(`📡 New Client Connected: ${socket.id}`);
    socket.on('disconnect', () => console.log('👋 Client Disconnected'));
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));
app.use('/api/parking', require('./routes/parkingRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Background Monitor: Check for overstays every 30 seconds
const { checkOverstays } = require('./controllers/notificationController');
setInterval(() => {
    checkOverstays(io);
}, 30000); 

app.get('/', (req, res) => {
    res.send('Smart Parking & Visitor Management System API is Online...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`💥 ERROR: ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
    console.log(`🚀 SaaS Server Running on port ${PORT}`);
});
