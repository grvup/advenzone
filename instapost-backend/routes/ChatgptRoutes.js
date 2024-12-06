const express = require('express');
const { searchItinerary } = require('../controllers/getGptQuery');

const router = express.Router();

// Route to get all hashtags
router.post('/gptquery', searchItinerary);

module.exports = router;