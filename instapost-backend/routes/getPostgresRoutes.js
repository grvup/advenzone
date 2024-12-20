const express = require('express');
const { getLocations , getActivities , getPastItineraries} = require('../controllers/getPostgresData');

const router = express.Router();

// Route to get all hashtags
router.get('/locations', getLocations);
router.get('/activities', getActivities);
router.get('/historyitinerary', getPastItineraries);

module.exports = router;
