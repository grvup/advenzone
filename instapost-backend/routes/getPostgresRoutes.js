const express = require('express');
const { getLocations , getActivities } = require('../controllers/getPostgresData');

const router = express.Router();

// Route to get all hashtags
router.get('/locations', getLocations);
router.get('/activities', getActivities);

module.exports = router;
