import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import useFetch, { BASE_URL } from "../../hooks/useFetch";
import dayjs from "dayjs";
import { FaClock, FaCalendarAlt, FaTag, FaHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "./style.scss";

const MovieDetails = () => {
  const { id } = useParams();
  const { resData, loading, error } = useFetch(`/api/movie/getmovie/${id}`);
  const movie = resData?.data?.movie;

  const handleAddToFavorites = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      toast.info("Please login to add to favorites");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/favorite/addfavorite`, {
        userEmail,
        movieId: movie._id,
        movieDetails: movie,
      });
      if (res.data.success) {
        toast.success("Saved to your favorites!");
      }
    } catch (err) {
      toast.warn(err.response?.data?.message || "Could not save favorite");
    }
  };

  return (
    <div className="movie-details-page">
      <Header />
      <div className="details-container">
        {loading ? (
          <Loader />
        ) : error || !movie ? (
          <div className="error-box">Movie details not found.</div>
        ) : (
          <div className="details-content">
            <div className="poster-col">
              <img
                src={movie.media || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60"}
                alt={movie.movieName}
              />
            </div>

            <div className="info-col">
              <div className="header-meta">
                <span className="cert-pill">{movie.certification || "U/A"}</span>
                <button className="fav-btn" onClick={handleAddToFavorites}>
                  <FaHeart /> Favorite
                </button>
              </div>

              <h1>{movie.movieName}</h1>

              <div className="specs-row">
                <span><FaClock /> {movie.runtime || 120} min</span>
                <span><FaCalendarAlt /> Released: {dayjs(movie.releaseDate).format("MMMM D, YYYY")}</span>
              </div>

              <div className="genre-list">
                {movie.genres?.map((g) => (
                  <span key={g} className="genre-pill">
                    <FaTag /> {g}
                  </span>
                ))}
              </div>

              <div className="synopsis">
                <h3>Synopsis</h3>
                <p>{movie.description}</p>
              </div>

              <div className="booking-cta">
                <Link to={`/shows/${encodeURIComponent(movie.movieName)}`} className="book-now-btn">
                  Check Available Showtimes & Book
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetails;
