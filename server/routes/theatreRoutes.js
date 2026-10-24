const express = require("express");
const router = express.Router();
const Theatre = require("../models/theatreModel");

// GET: /api/theatre/gettheatres
router.get("/gettheatres", async (req, res) => {
  try {
    const theatres = await Theatre.find();
    res.json({ success: true, theatres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: /api/theatre/gettheatre/:id
router.get("/gettheatre/:id", async (req, res) => {
  try {
    const theatre = await Theatre.findOne({ theatreId: req.params.id }) || await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }
    res.json({ success: true, theatre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: /api/theatre/addtheatre
router.post("/addtheatre", async (req, res) => {
  try {
    const {
      theatreName,
      theatreId,
      location,
      balconySeatPrice,
      middleSeatPrice,
      lowerSeatPrice,
      balconySeats,
      middleSeats,
      lowerSeats,
    } = req.body;

    const theatre = new Theatre({
      theatreName,
      theatreId: theatreId || `TH_${Date.now()}`,
      location,
      balconySeatPrice,
      middleSeatPrice,
      lowerSeatPrice,
      balconySeats: balconySeats || { rows: 4, cols: 10 },
      middleSeats: middleSeats || { rows: 6, cols: 10 },
      lowerSeats: lowerSeats || { rows: 4, cols: 10 },
    });

    await theatre.save();
    res.status(201).json({ success: true, theatre });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE: /api/theatre/deletetheatre/:id
router.delete("/deletetheatre/:id", async (req, res) => {
  try {
    await Theatre.findOneAndDelete({ theatreId: req.params.id }) || await Theatre.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Theatre deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
