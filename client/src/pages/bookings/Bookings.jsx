import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import useFetch, { BASE_URL } from "../../hooks/useFetch";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTicketAlt, FaTrash } from "react-icons/fa";
import "./style.scss";

const Bookings = () => {
  const userEmail = localStorage.getItem("userEmail") || "";
  const { resData, loading, error } = useFetch(`/api/bookings/userbookings/${userEmail}`);
  const bookings = resData?.data?.bookings || [];

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/api/bookings/cancelbooking/${bookingId}`);
      if (res.data.success) {
        toast.success("Booking cancelled and seats released.");
        window.location.reload();
      }
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <div className="bookings-page">
      <Header />
      <div className="bookings-container">
        <h2><FaTicketAlt /> My Bookings</h2>
        <p className="subtitle">View and manage your reserved movie tickets</p>

        {loading ? (
          <Loader />
        ) : bookings.length === 0 ? (
          <div className="empty-box">
            <p>You have not booked any movie tickets yet.</p>
            <a href="/home" className="explore-btn">Book Your First Movie</a>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((b) => {
              const data = b.ticketsData || {};
              return (
                <div key={b._id} className="booking-card">
                  <div className="ticket-header">
                    <span className="booking-id">ID: {b.bookingId}</span>
                    <span className="badge-confirmed">CONFIRMED</span>
                  </div>

                  <div className="ticket-body">
                    <h3>{data.movieName || "Movie Screening"}</h3>
                    <p className="theatre-line">📍 {data.theatreName}</p>
                    <div className="schedule-line">
                      <span>📅 {data.showdate}</span>
                      <span>⏰ {data.showtime}</span>
                    </div>

                    <div className="seats-reserved">
                      <strong>Seats: </strong>
                      {data.seats?.map((s) => s.seatNumber).join(", ") || "Standard"}
                    </div>

                    <div className="amount-line">
                      Total Paid: <strong>${data.totalAmount || 0}</strong>
                    </div>
                  </div>

                  <div className="ticket-actions">
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelBooking(b.bookingId)}
                    >
                      <FaTrash /> Cancel Ticket
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

export default Bookings;
