const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const fetchUser = require("../middlewares/fetchUser");

// GET: /api/bookings/getbookings (for admin or user)
router.get("/getbookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ _id: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: /api/bookings/userbookings/:email
router.get("/userbookings/:email", async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email }).sort({ _id: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: /api/bookings/addbooking
router.post("/addbooking", async (req, res) => {
  try {
    const { bookingId, userEmail, showId, ticketsData } = req.body;

    // Check show and mark seats as booked
    const show = await Show.findOne({ showId }) || await Show.findById(showId);
    if (show && show.tickets && ticketsData && ticketsData.seats) {
      ticketsData.seats.forEach((seat) => {
        const cat = seat.category || "middle";
        const sId = seat.seatId;
        if (show.tickets[cat] && show.tickets[cat][sId]) {
          show.tickets[cat][sId].isBooked = true;
        }
      });
      show.markModified("tickets");
      await show.save();
    }

    const booking = new Booking({
      bookingId: bookingId || `BK_${Date.now()}`,
      userEmail,
      showId,
      ticketsData,
    });

    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE: /api/bookings/cancelbooking/:id
router.delete("/cancelbooking/:id", async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ bookingId: req.params.id }) || await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Release seats in show
    const show = await Show.findOne({ showId: booking.showId });
    if (show && show.tickets && booking.ticketsData && booking.ticketsData.seats) {
      booking.ticketsData.seats.forEach((seat) => {
        const cat = seat.category || "middle";
        const sId = seat.seatId;
        if (show.tickets[cat] && show.tickets[cat][sId]) {
          show.tickets[cat][sId].isBooked = false;
        }
      });
      show.markModified("tickets");
      await show.save();
    }

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
