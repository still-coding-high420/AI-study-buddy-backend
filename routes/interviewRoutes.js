const express = require('express');
const router = express.Router();
const { askAI, getChatHistory } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

// Route to ask a question (POST request)
router.post('/ask', protect, askAI);

// Route to get chat history (GET request)
router.get('/history', protect, getChatHistory);

module.exports = router;
