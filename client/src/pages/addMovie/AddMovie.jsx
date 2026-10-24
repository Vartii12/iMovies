import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import render from "../../host";
import "../admin/style.scss";

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    movieName: "",
    description: "",
    genres: "",
    releaseDate: "",
    runtime: 120,
    certification: "U/A",
    media: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        genres: formData.genres.split(",").map((g) => g.trim()),
      };
      const res = await axios.post(`${render}/api/movie/addmovie`, payload);
      if (res.data.success) {
        toast.success("Movie added to catalogue!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-strip">
        <h2>Add New Movie</h2>
        <Link to="/admin" className="action-pill">← Back to Admin</Link>
      </div>

      <div className="admin-content" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Movie Title</label>
            <input
              type="text"
              name="movieName"
              placeholder="e.g. Oppenheimer"
              value={formData.movieName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Poster Image URL</label>
            <input
              type="url"
              name="media"
              placeholder="https://..."
              value={formData.media}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Genres (comma separated)</label>
            <input
              type="text"
              name="genres"
              placeholder="Action, Sci-Fi, Thriller"
              value={formData.genres}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Runtime (min)</label>
              <input
                type="number"
                name="runtime"
                value={formData.runtime}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Plot overview..."
              value={formData.description}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#e50914", color: "#fff", padding: "12px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            {loading ? "Adding..." : "Save Movie"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
