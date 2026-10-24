import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import useFetch, { BASE_URL } from "../../hooks/useFetch";
import { FaSearch, FaStar, FaFilm, FaCalendarAlt, FaClock } from "react-icons/fa";
import "./style.scss";

const Home = () => {
  const { resData, loading, error } = useFetch("/api/movie/getmovies");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const movies = resData?.data?.movies || [];

  const allGenres = ["All", ...new Set(movies.flatMap((m) => m.genres || []))];

  const filteredMovies = movies.filter((m) => {
    const matchesSearch = m.movieName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || (m.genres && m.genres.includes(selectedGenre));
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="home-page">
      <Header />
      <div className="home-container">
        <div className="filter-bar">
          <div className="search-box">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Search movies by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="genre-pills">
            {allGenres.map((g) => (
              <button
                key={g}
                className={`genre-pill ${selectedGenre === g ? "active" : ""}`}
                onClick={() => setSelectedGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <section className="movies-section">
          <div className="section-header">
            <h2>Now Showing in Theatres</h2>
            <p>Select a movie to explore showtimes and book seats</p>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="error-box">Unable to fetch movies right now.</div>
          ) : filteredMovies.length === 0 ? (
            <div className="empty-box">No movies found matching your query.</div>
          ) : (
            <div className="movies-grid">
              {filteredMovies.map((movie) => (
                <div key={movie._id} className="movie-card">
                  <div className="poster-wrapper">
                    <img
                      src={movie.media || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60"}
                      alt={movie.movieName}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
                      }}
                    />
                    <span className="cert-badge">{movie.certification || "U/A"}</span>
                  </div>

                  <div className="movie-info">
                    <h3>{movie.movieName}</h3>
                    <div className="meta-info">
                      <span><FaClock /> {movie.runtime || 120} min</span>
                      <span><FaCalendarAlt /> {new Date(movie.releaseDate).getFullYear()}</span>
                    </div>

                    <div className="genre-tags">
                      {movie.genres?.slice(0, 3).map((g) => (
                        <span key={g} className="tag">{g}</span>
                      ))}
                    </div>

                    <div className="card-actions">
                      <Link to={`/movie/${movie._id}`} className="details-btn">
                        Details
                      </Link>
                      <Link to={`/shows/${encodeURIComponent(movie.movieName)}`} className="book-btn">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
