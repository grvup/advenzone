const mongoose = require('mongoose');

const HashtagSchema = new mongoose.Schema({
    _id: String,
    hashtag_name: String,
    posts: Array
});

// Specify the collection name as 'hashtags' in the third parameter
module.exports = mongoose.model('Hashtag', HashtagSchema, 'hashtags');
