import React, { useState, useEffect } from "react";
import "../HashtagFeed.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const HashtagFeedLocation = () => {
  const [posts, setPosts] = useState([]); // State to store posts
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for errors
  const { locationid, locationname } = useParams();
  const [activities, setActivities] = useState([]); // State to store activities
  const [errorActivity, setErrorActivity] = useState(null); // State for activity errors
  const navigate = useNavigate();

  // Fetch activities on component mount
  useEffect(() => {
    const getActivities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/activities`, {
          params: { locationid },
        });
        setActivities(response.data);
        setErrorActivity(null);
      } catch (err) {
        setErrorActivity("Failed to fetch activities");
        setActivities([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getActivities();
  }, [locationid]);

  // Navigate to activity-specific page
  const handleActivityClick = (activityid,addressline1) => {
    const activityname = addressline1.replace(/\s+/g, "-");
    navigate(`/location/${locationid}/activity-details/${activityid}/${locationname}/${activityname}`);
  };

  return (
    <div className="hashtag-feed">
      <h2 style={{ color: "black" }}>Explore Activities in {locationname}</h2>

      {loading && <p>Loading activities...</p>}
      {errorActivity && <p className="error">{errorActivity}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="activity-tile"
            onClick={() => handleActivityClick(activity.id,activity.addressline1)}
            style={{
              width: "45%",
              margin: "10px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>{activity.addressline1}</h3>
            <p>{activity.city}</p>
          </div>
        ))}
      </div>

      <h2 style={{ color: "black" }}>Posts by Location</h2>
      {loading && <p>Loading posts...</p>}
      {error && <p className="error">{error}</p>}

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
        <p className="no-posts">No posts found for {locationname}</p>
      )}
    </div>
  );
};

export default HashtagFeedLocation;
