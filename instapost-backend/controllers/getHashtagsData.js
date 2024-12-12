const Hashtag = require('../models/hashTags');

// Controller function to get all hashtags
// const getHashtags = async (req, res) => {
//     const { hashtag } = req.query;
//     console.log(hashtag)
//     try {
//         const posts = await Hashtag.find({ hashtag_name: hashtag });
//         // console.log(posts[0].posts)
//         if (posts.length === 0) {
//             return res.status(404).json({ message: 'No posts found for this hashtag' });
//         }
//         res.json(posts[0].posts);  // Return the posts as JSON
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch posts' });
//     }
// };

// * Controller function to get posts by hashtag substring search
// * Searches for hashtags containing the given substring and returns all matching posts

// const getHashtags = async (req, res) => {
//    const { hashtag } = req.query;
//    console.log('Searching for hashtag:', hashtag);

//    if (!hashtag) {
//        return res.status(400).json({ message: 'Hashtag query parameter is required' });
//    }

//    try {
//        // Use regex to find hashtags that contain the search string (case-insensitive)
//        const matchingHashtags = await Hashtag.find({
//            hashtag_name: {
//                $regex: hashtag,
//                $options: 'i' // Case-insensitive matching
//            }
//        }).lean(); // Use lean() to get plain JavaScript objects

//        if (matchingHashtags.length === 0) {
//            return res.status(404).json({ 
//                message: 'No hashtags found matching the search term',
//                searchTerm: hashtag
//            });
//        }

//        // Collect all posts from matching hashtags
//        const allPosts = matchingHashtags.reduce((posts, hashtag) => {
//            // Add hashtag_name to each post for reference
//            const postsWithHashtag = hashtag.posts.map(post => ({
//                ...post, // Post is already a plain object due to lean()
//                matched_hashtag: hashtag.hashtag_name
//            }));
//            return [...posts, ...postsWithHashtag];
//        }, []);
//     //    console.log(allPosts)
//        // Remove duplicates if a post appears in multiple hashtags
//        const uniquePosts = Array.from(new Map(
//            allPosts.map(post => [post.id || post._id?.toString(), post])
//        ).values());

//        // Return response with additional metadata
//        res.json({
//            total_posts: uniquePosts.length,
//            matching_hashtags: matchingHashtags.map(h => h.hashtag_name),
//            posts: uniquePosts
//        });

//    } catch (error) {
//        console.error('Error fetching hashtag posts:', error);
//        res.status(500).json({ 
//            message: 'Failed to fetch posts',
//            error: error.message 
//        });
//    }
// };

const getHashtags = async (req, res) => {
    const { hashtag } = req.query;
    console.log('Searching for hashtag:', hashtag);
    console.log(hashtag)
    if (!hashtag) {
        return res.status(400).json({ message: 'Hashtag query parameter is required' });
    }
 
    try {
        // Split hashtag query into individual keywords, handling various delimiters
        const keywords = hashtag.split(/[ ,|;-]+/).filter(Boolean); // Split by space, comma, pipe, or semicolon
        console.log(keywords)
 
        if (keywords.length === 0) {
            return res.status(400).json({ message: 'At least one valid hashtag is required' });
        }
 
        // Use $or to find hashtags matching any of the keywords
        const matchingHashtags = await Hashtag.find({
            $or: keywords.map(kw => ({
                hashtag_name: {
                    $regex: kw,
                    $options: 'i' // Case-insensitive matching
                }
            }))
        }).lean();
 
        if (matchingHashtags.length === 0) {
            return res.status(404).json({ 
                message: 'No hashtags found matching the search terms',
                searchTerms: keywords
            });
        }
 
        // Collect all posts from matching hashtags
        const allPosts = matchingHashtags.reduce((posts, hashtag) => {
            // Add hashtag_name to each post for reference
            const postsWithHashtag = hashtag.posts.map(post => ({
                ...post,
                matched_hashtag: hashtag.hashtag_name
            }));
            return [...posts, ...postsWithHashtag];
        }, []);
 
        // Remove duplicates if a post appears in multiple hashtags
        const uniquePosts = Array.from(new Map(
            allPosts.map(post => [post.id || post._id?.toString(), post])
        ).values());
 
        // Return response with additional metadata
        res.json({
            total_posts: uniquePosts.length,
            matching_hashtags: matchingHashtags.map(h => h.hashtag_name),
            posts: uniquePosts
        });
 
    } catch (error) {
        console.error('Error fetching hashtag posts:', error);
        res.status(500).json({ 
            message: 'Failed to fetch posts',
            error: error.message 
        });
    }
 };
 
 module.exports = { getHashtags };
 
// module.exports = { getHashtags };
