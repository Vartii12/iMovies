import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import render from "../../host";
import "../admin/style.scss";

const AddShow = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [formData, setFormData] = useState({
    movieId: "",
    theatreName: "",
    showdate: "",
    showtime: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${render}/api/movie/getmovies`).then((res) => {
      if (res.data.success && res.data.movies.length > 0) {
        setMovies(res.data.movies);
        setFormData((prev) => ({ ...prev, movieId: res.data.movies[0].movieName }));
      }
    });

    axios.get(`${render}/api/theatre/gettheatres`).then((res) => {
      if (res.data.success && res.data.theatres.length > 0) {
        setTheatres(res.data.theatres);
        setFormData((prev) => ({ ...prev, theatreName: res.data.theatres[0].theatreName }));
      }
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${render}/api/shows/addshow`, formData);
      if (res.data.success) {
        toast.success("Showtime scheduled successfully!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule show");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-strip">
        <h2>Schedule Movie Show</h2>
        <Link to="/admin" className="action-pill">← Back to Admin</Link>
      </div>

      <div className="admin-content" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Select Movie</label>
            <select
              name="movieId"
              value={formData.movieId}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
            >
              {movies.map((m) => (
                <option key={m._id} value={m.movieName}>
                  {m.movieName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Select Theatre</label>
            <select
              name="theatreName"
              value={formData.theatreName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
            >
              {theatres.map((t) => (
                <option key={t._id} value={t.theatreName}>
                  {t.theatreName} ({t.location})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Show Date</label>
              <input
                type="date"
                name="showdate"
                value={formData.showdate}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Show Time (24h format e.g. 19:30)</label>
              <input
                type="text"
                name="showtime"
                placeholder="19:30"
                value={formData.showtime}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#e50914", color: "#fff", padding: "12px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            {loading ? "Scheduling..." : "Create Show"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShow;
