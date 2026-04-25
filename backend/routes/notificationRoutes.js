const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');

// @route   GET /api/notifications
router.get('/', getNotifications);

// @route   PUT /api/notifications/:id
router.put('/:id', markAsRead);

module.exports = router;
