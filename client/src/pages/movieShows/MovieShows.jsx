import React from "react";
import dayjs from "dayjs";
import "./style.scss";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import useFetch from "../../hooks/useFetch";
import { BiCameraMovie } from "react-icons/bi";
import { TbMovieOff } from "react-icons/tb";
import { useNavigate, useParams, Link } from "react-router-dom";

const MovieShows = () => {
  const navigate = useNavigate();
  const { movieName } = useParams();
  const { resData, loading, error } = useFetch(
    `/api/shows/getmovieshows/${movieName}`
  );

  const showsData = resData?.data?.showData;

  showsData?.sort(function (a, b) {
    // Concatenate date and time strings for comparison
    var datetimeA = new Date(a.showdate + "T" + a.showtime + "Z");
    var datetimeB = new Date(b.showdate + "T" + b.showtime + "Z");

    return datetimeA - datetimeB;
  });

  function convertTo12HourFormat(time24) {
    if (!time24) return "";
    // Split the time string into hours and minutes
    var [hours, minutes] = time24.split(":");

    // Convert hours to integer
    hours = parseInt(hours);

    // Determine AM or PM
    var meridiem = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    // Return formatted time string
    return hours + ":" + minutes + " " + meridiem;
  }

  return (
    <div className="movie-shows-page">
      <Header />
      <div className="shows-container">
        <div className="shows-header">
          <Link to="/home" className="back-link">← Back to Movies</Link>
          <h2>
            <BiCameraMovie /> Shows for {decodeURIComponent(movieName)}
          </h2>
          <p>Select your desired theatre and screening time to book seats</p>
        </div>

        {loading ? (
          <Loader />
        ) : error || !showsData || showsData.length === 0 ? (
          <div className="no-shows">
            <TbMovieOff className="empty-icon" />
            <h3>No Scheduled Shows Found</h3>
            <p>There are currently no active screenings scheduled for this movie.</p>
            <Link to="/home" className="browse-btn">Explore Other Movies</Link>
          </div>
        ) : (
          <div className="shows-list">
            {showsData.map((show) => (
              <div key={show._id || show.showId} className="show-card">
                <div className="show-theatre">
                  <h4>{show.theatreName}</h4>
                  <span className="show-date">
                    📅 {dayjs(show.showdate).format("dddd, MMM D, YYYY")}
                  </span>
                </div>

                <div className="show-meta">
                  <div className="time-pill">
                    ⏰ {convertTo12HourFormat(show.showtime)}
                  </div>
                </div>

                <div className="show-action">
                  <button
                    className="select-seat-btn"
                    onClick={() => navigate(`/seats/${show.showId || show._id}`)}
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MovieShows;
