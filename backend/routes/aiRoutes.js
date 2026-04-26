const express = require('express');
const router = express.Router();
const { askAssistant, analyzeVisitor, getDailySummary } = require('../controllers/aiController');

// 🤖 Chat with AI Assistant
router.post('/ask', askAssistant);

// 🔍 Analyze a specific visitor
router.get('/analyze/:visitorId', analyzeVisitor);

// 📊 Get AI-generated daily summary
router.get('/summary', getDailySummary);

module.exports = router;
