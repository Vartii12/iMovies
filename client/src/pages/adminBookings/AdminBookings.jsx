import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import render from "../../host";
import { FaTrash, FaTicketAlt } from "react-icons/fa";
import "../admin/style.scss";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${render}/api/bookings/getbookings`);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      toast.error("Failed to load customer bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel customer booking and release seats?")) return;
    try {
      const res = await axios.delete(`${render}/api/bookings/cancelbooking/${bookingId}`);
      if (res.data.success) {
        toast.success("Booking cancelled and seats released");
        setBookings(bookings.filter((b) => b.bookingId !== bookingId));
      }
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-strip">
        <h2>Customer Reservations & Bookings</h2>
        <Link to="/admin" className="action-pill">← Back to Admin</Link>
      </div>

      <div className="admin-content">
        <h3>All Recorded Bookings ({bookings.length})</h3>

        {loading ? (
          <Loader />
        ) : bookings.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No customer bookings recorded yet.</p>
        ) : (
          <div className="admin-movie-table-wrapper">
            <table className="admin-movie-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User Email</th>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Date & Time</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const data = b.ticketsData || {};
                  return (
                    <tr key={b._id}>
                      <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{b.bookingId}</td>
                      <td>{b.userEmail}</td>
                      <td><strong>{data.movieName}</strong></td>
                      <td>{data.theatreName}</td>
                      <td>{data.showdate} @ {data.showtime}</td>
                      <td>{data.seats?.map((s) => s.seatNumber).join(", ")}</td>
                      <td style={{ color: "#10b981", fontWeight: "bold" }}>${data.totalAmount}</td>
                      <td>
                        <button
                          className="del-btn"
                          onClick={() => handleCancel(b.bookingId)}
                          title="Cancel Reservation"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
