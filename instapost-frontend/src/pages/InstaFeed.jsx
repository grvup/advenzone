// src/InstagramFeed.js
import React ,{useEffect, useState} from 'react';
import './InstaFeed.css'; // Create a CSS file to style the component

// Dummy data simulating Instagram posts
  // const [hashtag, setHashtag] = useState("");
import axios from 'axios';
  
  const InstaFeed = () => {
    const [posts, setPosts] = useState([]);  // State to store posts from API
    const [loading, setLoading] = useState(false);  // State for loading status
    const [error, setError] = useState(null);  // State for any errors
    const username = "advenzone"
    // Function to fetch posts from API based on the selected hashtag
    const fetchPosts = async (username) => {
      if (!username) return;  // If no hashtag, return early

      setLoading(true);
      setError(null);  // Reset any previous errors

      try {
        const response = await axios.get(`http://localhost:5000/api/posts`, {
          params: { username },  
        });
          // const data = await response.json();

          // if (response.ok) {
            setPosts(response.data);  // Set the posts state with the fetched data
          // } else {
          //   setError(response.data.message || 'Failed to fetch posts');
          // }
        console.log('API Response:', response.data);
      } catch (err) {
        setError(`Failed to fetch posts for #${username}`);
        setPosts([])
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Effect to fetch posts whenever the hashtag changes
    useEffect(() => {
      fetchPosts(username);
    }, []);
  return (
    <div className="instagram-feed">
      <h2>Instagram Posts</h2>
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div key={post.id || index} className="post">
            <div className="post-header">
              <div>
                <h3 className="username">{post.media_type}</h3>
                <p className="date">{post.date}</p>
              </div>
            </div>
            {post.media_type === "VIDEO" ? (
              <video
                src={post.media_url}
                controls
                className="post-video"
              />
            ) : (
              <img src={post.media_url} alt="Post" className="post-image" />
            )}
            <p className="caption">{post.caption}</p>
            <div className="post-footer">
              <span className="likes">👍 {post.like_count}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="no-posts">No posts found for #{username}</p>
      )}
    </div>
  );
};

export default InstaFeed;
