const express = require('express');
const { getPosts } = require('../controllers/getPostsData');

const router = express.Router();

// Route to get all hashtags
router.get('/posts', getPosts);

module.exports = router;
