const express = require('express');
const router = express.Router();
const { login, sendOtp, verifyOtp, register, forgotPassword, logout } = require('../controllers/userController');

// @route   POST /api/users/register
router.post('/register', register);

// @route   POST /api/users/login
router.post('/login', login);

// @route   POST /api/users/send-otp
router.post('/send-otp', sendOtp);

// @route   POST /api/users/verify-otp
router.post('/verify-otp', verifyOtp);

// @route   POST /api/users/forgot-password
router.post('/forgot-password', forgotPassword);

// @route   POST /api/users/logout
router.post('/logout', logout);

module.exports = router;
