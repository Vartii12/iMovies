const express = require("express");
const router = express.Router();
const Show = require("../models/showModel");
const Theatre = require("../models/theatreModel");

// Helper to generate seat map from theatre details
const initializeTickets = (theatre) => {
  const categories = ["balcony", "middle", "lower"];
  const tickets = {};
  
  categories.forEach((cat) => {
    tickets[cat] = {};
    const catConfig = theatre[cat + "Seats"] || { rows: 4, cols: 10 };
    const rows = catConfig.rows || 4;
    const cols = catConfig.cols || 10;
    const price = theatre[cat + "SeatPrice"] || 150;

    for (let r = 1; r <= rows; r++) {
      const rowLetter = String.fromCharCode(64 + r); // A, B, C...
      for (let c = 1; c <= cols; c++) {
        const seatId = `${cat[0].toUpperCase()}_${rowLetter}${c}`;
        tickets[cat][seatId] = {
          seatNumber: `${rowLetter}${c}`,
          category: cat,
          price: price,
          isBooked: false,
          locked: false,
        };
      }
    }
  });

  return tickets;
};

// GET: /api/shows/getshows
router.get("/getshows", async (req, res) => {
  try {
    const shows = await Show.find();
    res.json({ success: true, shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: /api/shows/getmovieshows/:movieName
router.get("/getmovieshows/:movieName", async (req, res) => {
  try {
    const { movieName } = req.params;
    const decodedName = decodeURIComponent(movieName);
    const shows = await Show.find({
      $or: [
        { movieId: decodedName },
        { theatreName: { $regex: new RegExp(decodedName, "i") } },
      ],
    });
    // Return structured payload matching resData?.data?.showData
    res.json({
      success: true,
      data: {
        showData: shows,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: /api/shows/getshow/:showId
router.get("/getshow/:showId", async (req, res) => {
  try {
    const show = await Show.findOne({ showId: req.params.showId }) || await Show.findById(req.params.showId);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    res.json({ success: true, show });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: /api/shows/addshow
router.post("/addshow", async (req, res) => {
  try {
    const { adminEmail, showId, movieId, theatreName, showdate, showtime } = req.body;

    // Check if theatre exists to initialize seats
    const theatre = await Theatre.findOne({ theatreName });
    let tickets = req.body.tickets;

    if (!tickets && theatre) {
      tickets = initializeTickets(theatre);
    } else if (!tickets) {
      // Default seat layout
      tickets = initializeTickets({
        balconySeatPrice: 300,
        middleSeatPrice: 200,
        lowerSeatPrice: 120,
        balconySeats: { rows: 3, cols: 8 },
        middleSeats: { rows: 5, cols: 8 },
        lowerSeats: { rows: 3, cols: 8 },
      });
    }

    const show = new Show({
      adminEmail: adminEmail || "admin@imovies.com",
      showId: showId || `SHOW_${Date.now()}`,
      movieId,
      theatreName,
      showdate,
      showtime,
      tickets,
    });

    await show.save();
    res.status(201).json({ success: true, show });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE: /api/shows/deleteshow/:showId
router.delete("/deleteshow/:showId", async (req, res) => {
  try {
    await Show.findOneAndDelete({ showId: req.params.showId }) || await Show.findByIdAndDelete(req.params.showId);
    res.json({ success: true, message: "Show deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
