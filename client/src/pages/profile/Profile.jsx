import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { FaUser, FaEnvelope, FaTicketAlt, FaHeart, FaEdit } from "react-icons/fa";
import "../bookings/style.scss";

const Profile = () => {
  const username = localStorage.getItem("username") || "Movie Buff";
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";

  return (
    <div className="bookings-page">
      <Header />
      <div className="bookings-container" style={{ maxWidth: "600px" }}>
        <div style={{ background: "#141724", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#e50914", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
              <FaUser />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "22px" }}>{username}</h2>
              <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}><FaEnvelope /> {userEmail}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
            <Link to="/bookings" style={{ background: "#1e2235", padding: "16px", borderRadius: "8px", textDecoration: "none", color: "#fff", textAlign: "center" }}>
              <FaTicketAlt style={{ fontSize: "20px", color: "#38bdf8", marginBottom: "6px" }} />
              <div style={{ fontWeight: "600", fontSize: "14px" }}>My Bookings</div>
            </Link>
            <Link to="/favorites" style={{ background: "#1e2235", padding: "16px", borderRadius: "8px", textDecoration: "none", color: "#fff", textAlign: "center" }}>
              <FaHeart style={{ fontSize: "20px", color: "#ef4444", marginBottom: "6px" }} />
              <div style={{ fontWeight: "600", fontSize: "14px" }}>Watchlist</div>
            </Link>
          </div>

          <Link
            to="/profile/edit"
            style={{
              display: "block",
              textAlign: "center",
              background: "rgba(255,255,255,0.08)",
              color: "#cbd5e1",
              padding: "10px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <FaEdit /> Edit Account Details
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
