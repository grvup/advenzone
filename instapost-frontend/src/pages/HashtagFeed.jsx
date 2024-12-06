import React, { useState, useEffect } from "react";
import "./HashtagFeed.css";
import InstagramEmbed from "./InstagramFeed";
import axios from "axios"; // import axios

const HashtagFeed = () => {
  const [hashtag, setHashtag] = useState("");
  const [posts, setPosts] = useState([]);  // State to store posts from API
  const [loading, setLoading] = useState(false);  // State for loading status
  const [error, setError] = useState(null);  // State for any errors

  // Function to fetch posts from API based on the selected hashtag
  const fetchPosts = async (hashtag) => {
    if (!hashtag) return;  // If no hashtag, return early

    setLoading(true);
    setError(null);  // Reset any previous errors

    try {
      const response = await axios.get(`http://localhost:5000/api/hashtags`, {
        params: { hashtag },  
      });
        // const data = await response.json();

        // if (response.ok) {
          setPosts(response.data.posts);  // Set the posts state with the fetched data
          console.log(response.data)
        // } else {
        //   setError(response.data.message || 'Failed to fetch posts');
        // }
      console.log('API Response:', response.data);
    } catch (err) {
      setError(`Failed to fetch posts for #${hashtag}`);
      setPosts([])
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch posts whenever the hashtag changes
  useEffect(() => {
    fetchPosts(hashtag);
  }, [hashtag]);

  console.log(posts)
  // Filter posts based on the selected hashtag
  // const posts = posts.filter((post) =>
  //   post.hashtags.includes(hashtag.toLowerCase())
  // );

  return (
    <div className="hashtag-feed">
      <h2 style={{ color: "black" }}>Posts by Hashtag</h2>

      {/* Input to select a hashtag */}
      <input
        type="text"
        placeholder="Enter a hashtag (e.g., travel)"
        value={hashtag}
        onChange={(e) =>
          setHashtag(e.target.value.replace("#", "").toLowerCase())
        }
        className="hashtag-input"
      />

      {/* Show loading message if data is being fetched */}
      {loading && <p>Loading posts...</p>}

      {/* Show error message if the request failed */}
      {error && <p className="error">{error}</p>}

      {/* Display posts based on the selected hashtag */}
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
        <p className="no-posts">No posts found for #{hashtag}</p>
      )}

      {/* <InstagramEmbed /> */}
    </div>
  );
};

export default HashtagFeed;
