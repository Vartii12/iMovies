import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaFilm, FaHeart, FaTicketAlt, FaUser, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import "./style.scss";

const Header = () => {
  const navigate = useNavigate();
  const userToken = Cookies.get("userToken") || localStorage.getItem("userToken");
  const adminToken = Cookies.get("adminToken") || localStorage.getItem("adminToken");
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    Cookies.remove("userToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <header className="header-nav">
      <div className="nav-container">
        <Link to="/home" className="brand">
          <FaFilm className="brand-icon" />
          <span>iMovies</span>
        </Link>

        <nav className="nav-links">
          <Link to="/home">Explore</Link>
          {userToken && (
            <>
              <Link to="/favorites">
                <FaHeart /> Favorites
              </Link>
              <Link to="/bookings">
                <FaTicketAlt /> My Bookings
              </Link>
              <Link to="/profile">
                <FaUser /> {username}
              </Link>
            </>
          )}

          {adminToken && (
            <Link to="/admin" className="admin-link">
              <FaShieldAlt /> Admin Dashboard
            </Link>
          )}

          {userToken ? (
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/register" className="register-link">Sign Up</Link>
              <Link to="/admin/login" className="admin-pill">Admin</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
