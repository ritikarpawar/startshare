import React, { useEffect, useState } from "react";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts");
        setPosts(response.data.posts || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts. Make sure backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="page-container">
      <div className={`feed-container ${posts.length > 4 ? "grid-layout" : "list-layout"}`}>
        {loading ? (
          <div className="empty-state">
            <p>Loading posts...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p style={{ color: '#D9534F' }}>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p style={{ marginTop: '8px' }}>Be the first to create and share a post!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <article key={post._id || index} className="post-card">
              {post.image && (
                <div className="post-image-container">
                  <img
                    src={post.image}
                    alt={post.caption || "User post"}
                    className="post-image"
                  />
                </div>
              )}
              {post.caption && (
                <div className="post-content">
                  <p className="post-caption">{post.caption}</p>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
