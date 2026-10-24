import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import useFetch, { BASE_URL } from "../../hooks/useFetch";
import axios from "axios";
import { toast } from "react-toastify";
import "./style.scss";

const SeatsPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { resData, loading, error } = useFetch(`/api/shows/getshow/${showId}`);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const show = resData?.data?.show;
  const tickets = show?.tickets || {};

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatId !== seat.seatId));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((acc, s) => acc + (s.price || 0), 0);
  };

  const handleConfirmBooking = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      toast.info("Please sign in to complete your booking");
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.warn("Please select at least one seat");
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        bookingId: `BK_${Date.now()}`,
        userEmail,
        showId: show.showId || showId,
        ticketsData: {
          movieName: show.movieId,
          theatreName: show.theatreName,
          showdate: show.showdate,
          showtime: show.showtime,
          seats: selectedSeats,
          totalAmount: calculateTotal(),
        },
      };

      const res = await axios.post(`${BASE_URL}/api/bookings/addbooking`, payload);
      if (res.data.success) {
        toast.success("🎉 Tickets booked successfully!");
        navigate("/bookings");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="seats-page">
      <Header />
      <div className="seats-container">
        {loading ? (
          <Loader />
        ) : error || !show ? (
          <div className="error-box">Show details not found.</div>
        ) : (
          <>
            <div className="show-summary-bar">
              <div>
                <h2>{show.movieId}</h2>
                <p>📍 {show.theatreName} | 📅 {show.showdate} | ⏰ {show.showtime}</p>
              </div>
              <Link to="/home" className="change-show-link">Change Show</Link>
            </div>

            <div className="screen-indicator">
              <div className="screen-curve"></div>
              <span>ALL EYES THIS WAY (CINEMA SCREEN)</span>
            </div>

            <div className="seating-layout">
              {Object.keys(tickets).map((category) => (
                <div key={category} className="seat-tier">
                  <div className="tier-header">
                    <h4>{category.toUpperCase()} TIER</h4>
                    <span className="price-tag">
                      ${Object.values(tickets[category])[0]?.price || 200}
                    </span>
                  </div>

                  <div className="seat-grid">
                    {Object.entries(tickets[category]).map(([seatKey, seat]) => {
                      const seatObj = { ...seat, seatId: seatKey };
                      const isSelected = selectedSeats.some((s) => s.seatId === seatKey);

                      return (
                        <button
                          key={seatKey}
                          disabled={seat.isBooked}
                          className={`seat-btn ${seat.isBooked ? "booked" : isSelected ? "selected" : "available"}`}
                          onClick={() => handleSeatClick(seatObj)}
                          title={`${seat.seatNumber} ($${seat.price})`}
                        >
                          {seat.seatNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="seat-legend">
              <div className="legend-item"><span className="seat-sample available"></span> Available</div>
              <div className="legend-item"><span className="seat-sample selected"></span> Selected</div>
              <div className="legend-item"><span className="seat-sample booked"></span> Booked</div>
            </div>

            <div className="booking-summary-panel">
              <div className="summary-details">
                <div>
                  <strong>Selected: </strong>
                  {selectedSeats.length > 0
                    ? selectedSeats.map((s) => s.seatNumber).join(", ")
                    : "None"}
                </div>
                <div className="total-price">
                  Total: <strong>${calculateTotal()}</strong>
                </div>
              </div>

              <button
                className="checkout-btn"
                disabled={selectedSeats.length === 0 || bookingLoading}
                onClick={handleConfirmBooking}
              >
                {bookingLoading ? "Reserving..." : "Confirm & Pay"}
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SeatsPage;
