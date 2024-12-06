const express = require('express');
const { getHashtags } = require('../controllers/getHashtagsData');

const router = express.Router();

// Route to get all hashtags
router.get('/hashtags', getHashtags);

module.exports = router;
