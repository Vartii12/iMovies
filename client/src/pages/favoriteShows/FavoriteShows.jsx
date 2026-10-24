import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import useFetch, { BASE_URL } from "../../hooks/useFetch";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";
import "../bookings/style.scss";

const FavoriteShows = () => {
  const userEmail = localStorage.getItem("userEmail") || "";
  const { resData, loading } = useFetch(`/api/favorite/getfavorites/${userEmail}`);
  const favorites = resData?.data?.favorites || [];

  const handleRemove = async (movieId) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/favorite/removefavorite`, {
        userEmail,
        movieId,
      });
      if (res.data.success) {
        toast.info("Removed from watchlist");
        window.location.reload();
      }
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="bookings-page">
      <Header />
      <div className="bookings-container">
        <h2><FaHeart style={{ color: "#ef4444" }} /> My Watchlist & Favorites</h2>
        <p className="subtitle">Movies you saved for upcoming viewings</p>

        {loading ? (
          <Loader />
        ) : favorites.length === 0 ? (
          <div className="empty-box">
            <p>Your watchlist is currently empty.</p>
            <Link to="/home" className="explore-btn">Browse Movies</Link>
          </div>
        ) : (
          <div className="bookings-grid">
            {favorites.map((fav) => {
              const movie = fav.movieDetails || {};
              return (
                <div key={fav._id} className="booking-card">
                  <div className="ticket-body">
                    <h3>{movie.movieName || fav.movieId}</h3>
                    <p className="theatre-line">
                      {Array.isArray(movie.genres) ? movie.genres.join(", ") : "Feature Film"}
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "12px" }}>
                      {movie.description?.slice(0, 100)}...
                    </p>
                  </div>

                  <div className="ticket-actions" style={{ display: "flex", gap: "10px" }}>
                    <Link
                      to={`/shows/${encodeURIComponent(movie.movieName || fav.movieId)}`}
                      style={{
                        background: "#e50914",
                        color: "#fff",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Book Show
                    </Link>
                    <button
                      className="cancel-btn"
                      onClick={() => handleRemove(fav.movieId)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FavoriteShows;
