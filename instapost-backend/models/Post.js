const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define schema for individual media posts
const mediaSchema = new Schema({
    post_id: { type: String, required: true }, 
    permalink: { type: String, required: false }, 
    media_type: { type: String, required: false }, 
    media_url: { type: String, required: false }, 
    caption: { type: String, required: false }, 
    timestamp: { type: Date, required: false },
    like_count: { type: Number, required: false }
}, { _id: false }); 

// Define schema for profile
const profileSchema = new Schema({
    username: { type: String, required: true, unique: true }, 
    website: { type: String, required: false }, 
    media_count: { type: Number, required: false }, 
    followers_count: { type: Number, required: false },
    follows_count: { type: Number, required: false }, 
    profile_picture_url: { type: String, required: false }, 
    biography: { type: String, required: false }, 
    posts: { type: [mediaSchema], default: [] } // Array of media posts
});

// Create and export the model
module.exports = mongoose.model('Profile', profileSchema,'profile_posts');
