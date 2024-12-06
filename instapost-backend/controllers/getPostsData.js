const Post = require('../models/Post');

// Controller function to get all hashtags
const getPosts = async (req, res) => {
    const { username } = req.query;
    console.log(username)
    try {
        const posts = await Post.find({ username: username });
        // console.log(posts[0].posts)
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this hashtag' });
        }
        res.json(posts[0].posts);  // Return the posts as JSON
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
};

module.exports = { getPosts };
