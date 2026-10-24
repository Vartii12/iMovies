import React, { useState } from "react";
import "./style.scss";
import Loader from "../../components/loader/Loader";
import dayjs from "dayjs";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import render from "../../host";

const MovieDetailsPopup = ({ movie, onClose }) => {
  if (!movie) return null;

  // Helper function to get the first available image URL
  const getImageUrl = (media) => {
    if (!media) return "/default-movie.png";

    // If media is a string, return it directly
    if (typeof media === "string") return media;

    // If media is an array, get the first item
    const mediaItem = Array.isArray(media) ? media[0] : media;

    // Return the URL property if it exists, otherwise return the item itself or default
    return mediaItem?.url || mediaItem || "/default-movie.png";
  };

  console.log("Movie data:", movie); // Debug log

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="movie-details-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <RxCross1 />
        </button>

        <div className="popup-body">
          <div className="popup-poster">
            <img src={getImageUrl(movie.media)} alt={movie.movieName} />
          </div>

          <div className="popup-details">
            <h2>{movie.movieName}</h2>
            <div className="popup-tags">
              <span className="cert-tag">{movie.certification || "U/A"}</span>
              <span className="runtime-tag">{movie.runtime || 120} min</span>
              <span className="date-tag">
                {movie.releaseDate ? dayjs(movie.releaseDate).format("MMM D, YYYY") : "Coming Soon"}
              </span>
            </div>

            <p className="genres">
              <strong>Genres:</strong> {Array.isArray(movie.genres) ? movie.genres.join(", ") : movie.genres}
            </p>

            <p className="desc">{movie.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${render}/api/movie/getmovies`);
      if (res.data.success) {
        setMovies(res.data.movies);
      }
    } catch (err) {
      toast.error("Failed to load movies for admin");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdminMovies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      const res = await axios.delete(`${render}/api/movie/deletemovie/${id}`);
      if (res.data.success) {
        toast.success("Movie deleted successfully");
        setMovies(movies.filter((m) => m._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete movie");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-strip">
        <h2>Cinema Admin Management</h2>
        <div className="quick-nav">
          <a href="/admin/addmovie" className="action-pill">+ Add Movie</a>
          <a href="/admin/addtheatre" className="action-pill">+ Add Theatre</a>
          <a href="/admin/addshow" className="action-pill">+ Add Show</a>
          <a href="/admin/bookings" className="action-pill">View Bookings</a>
          <a href="/home" className="action-pill home-pill">Live Site</a>
        </div>
      </div>

      <div className="admin-content">
        <h3>Catalogued Movies ({movies.length})</h3>

        {loading ? (
          <Loader />
        ) : (
          <div className="admin-movie-table-wrapper">
            <table className="admin-movie-table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genres</th>
                  <th>Runtime</th>
                  <th>Release Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <img
                        src={m.media || "/default-movie.png"}
                        alt={m.movieName}
                        className="table-thumb"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&auto=format&fit=crop&q=60";
                        }}
                      />
                    </td>
                    <td>
                      <strong
                        className="clickable-title"
                        onClick={() => setSelectedMovie(m)}
                      >
                        {m.movieName}
                      </strong>
                    </td>
                    <td>{Array.isArray(m.genres) ? m.genres.join(", ") : m.genres}</td>
                    <td>{m.runtime || 120} min</td>
                    <td>{dayjs(m.releaseDate).format("YYYY-MM-DD")}</td>
                    <td>
                      <button
                        className="del-btn"
                        onClick={() => handleDelete(m._id)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetailsPopup
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Admin;
