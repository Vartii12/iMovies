import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { FaTicketAlt, FaShieldAlt, FaPlayCircle } from "react-icons/fa";
import "./style.scss";

const Landing = () => {
  return (
    <div className="landing-page">
      <Header />
      <section className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="badge-featured">PREMIUM CINEMA EXPERIENCE</span>
          <h1>Book Tickets For Blockbuster Movies Anywhere, Anytime</h1>
          <p>
            Seamless real-time seat reservation, crystal-clear sound, and unforgettable cinematic magic with iMovies.
          </p>
          <div className="cta-group">
            <Link to="/home" className="btn-primary">
              <FaPlayCircle /> Explore Movies
            </Link>
            <Link to="/register" className="btn-secondary">
              <FaTicketAlt /> Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">🎟️</div>
            <h3>Real-Time Seat Booking</h3>
            <p>Pick your favorite seats with instantaneous live availability updates.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🍿</div>
            <h3>Best Multiplexes</h3>
            <p>Browse shows across premier IMAX, 4DX, and Dolby Atmos screens.</p>
          </div>
          <div className="feature-card">
            <div className="icon">💳</div>
            <h3>Instant Confirmation</h3>
            <p>Secure checkout and immediate booking tickets sent straight to your account.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Landing;
