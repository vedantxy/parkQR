const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

// @route   POST /api/users/register
router.post('/register', registerUser);

// @route   POST /api/users/login
router.post('/login', loginUser);

module.exports = router;
