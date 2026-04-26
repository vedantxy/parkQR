const express = require('express');
const router = express.Router();
const { login, sendOtp, verifyOtp } = require('../controllers/userController');

// @route   POST /api/users/login
router.post('/login', login);

// @route   POST /api/users/send-otp
router.post('/send-otp', sendOtp);

// @route   POST /api/users/verify-otp
router.post('/verify-otp', verifyOtp);

module.exports = router;
