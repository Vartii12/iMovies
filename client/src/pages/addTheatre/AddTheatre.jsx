import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import render from "../../host";
import "../admin/style.scss";

const AddTheatre = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    theatreName: "",
    theatreId: "",
    location: "",
    balconySeatPrice: 350,
    middleSeatPrice: 220,
    lowerSeatPrice: 120,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${render}/api/theatre/addtheatre`, {
        ...formData,
        theatreId: formData.theatreId || `TH_${Date.now()}`,
        balconySeats: { rows: 3, cols: 8 },
        middleSeats: { rows: 5, cols: 8 },
        lowerSeats: { rows: 3, cols: 8 },
      });
      if (res.data.success) {
        toast.success("Theatre added successfully!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add theatre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-strip">
        <h2>Add Cinema Multiplex / Theatre</h2>
        <Link to="/admin" className="action-pill">← Back to Admin</Link>
      </div>

      <div className="admin-content" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Theatre Name</label>
            <input
              type="text"
              name="theatreName"
              placeholder="e.g. INOX Megaplex"
              value={formData.theatreName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>Location / Screen Details</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Downtown Mall, Screen 2 (IMAX)"
              value={formData.location}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1", fontSize: "12px" }}>Balcony Price ($)</label>
              <input
                type="number"
                name="balconySeatPrice"
                value={formData.balconySeatPrice}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1", fontSize: "12px" }}>Middle Price ($)</label>
              <input
                type="number"
                name="middleSeatPrice"
                value={formData.middleSeatPrice}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1", fontSize: "12px" }}>Lower Price ($)</label>
              <input
                type="number"
                name="lowerSeatPrice"
                value={formData.lowerSeatPrice}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", background: "#0d0f15", color: "#fff", border: "1px solid #333", borderRadius: "6px" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#f59e0b", color: "#000", padding: "12px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            {loading ? "Adding..." : "Save Theatre"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTheatre;
