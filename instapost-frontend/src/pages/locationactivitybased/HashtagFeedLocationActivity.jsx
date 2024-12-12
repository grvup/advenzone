import React, { useState, useEffect } from "react";
import "../HashtagFeed.css";
import axios from "axios";
import { useParams , useNavigate } from 'react-router-dom';

const HashtagFeedLocationActivity = () => {
//   const [activities, setActivities] = useState([]); // State to store location APIs
//   const [selectedLocation, setSelectedLocation] = useState(""); // State for selected location
  const [posts, setPosts] = useState([]); // State to store posts
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for errors
  const [errorActivity, setErrorActivity] = useState(null); // State for errors
  const { activityname, locationname } = useParams();

  const hashtag = `${activityname}-${locationname}`.replace(/\s+/g, "-");
//   const [locations, setLocations] = useState([]); // State to store locations from API
//   const [selectedLocation, setSelectedLocation] = useState("Select Location"); // State for the selected location
//   const [loading, setLoading] = useState(false); // State for loading status
//   const [error, setError] = useState(null); // State for errors
//   const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown
  const navigate = useNavigate();

  
//   console.log(activities)

  // Function to fetch posts based on the selected location
  const fetchPosts = async (hashtag) => {
    if (!hashtag) return;
    console.log(hashtag)
    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      const response = await axios.get(`http://localhost:5000/api/hashtags`, {
        params: { hashtag },
      });
      setPosts(response.data.posts); // Set the posts state with the fetched data
    } catch (err) {
      setError(`Failed to fetch posts for ${locationname}`);
      setPosts([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations on component mount
//   useEffect(() => {
//     fetchLocations();
//   }, []);

  // Fetch posts whenever the selected location changes
  useEffect(() => {
    fetchPosts(hashtag);
  }, [hashtag]);

  return (
    <div className="hashtag-feed">
      <h2 style={{ color: "black" }}>Posts by Location</h2>

      {/* Dropdown to select a location */}
      {/* <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="location-select"
      >
        <option value="">Select a location</option>
        {locations.map((location) => (
          <option key={location.url} value={location.name}>
            {location.name}
          </option>
        ))}
      </select> */}

      {/* Show loading message if data is being fetched */}
      {loading && <p>Loading posts... </p>}

      {/* Show error message if the request failed */}
      {/* {error && <p className="error">{error}</p>} */}

      {/* Display posts based on the selected location */}
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
              <video src={post.media_url} controls className="post-video" />
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
        <p className="no-posts">No posts found for {locationname} {hashtag}</p>
      )}
    </div>
  );
};

export default HashtagFeedLocationActivity;
