import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Clean up the preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError("");

    if (file) {
      // Edge Case: Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. Please select an image under 5MB.");
        return;
      }

      // Edge Case: Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Invalid file type. Please select an image file.");
        return;
      }

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image to upload");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption.trim());

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    try {
      await axios.post(`${API_BASE_URL}/create-post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h2 className="form-title">Create New Post</h2>
        
        {error && (
          <div style={{ color: '#D9534F', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Choose Photo</label>
            <label className="file-dropzone">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "var(--text-secondary)" }}>
                  ⭐ Click to select or drag an image here
                </span>
              )}
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              className="form-textarea"
              rows="3"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Uploading..." : "Share Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
