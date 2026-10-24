const express = require("express");
const router = express.Router();
const Favorite = require("../models/favoriteModel");

// GET: /api/favorite/getfavorites/:email
router.get("/getfavorites/:email", async (req, res) => {
  try {
    const favorites = await Favorite.find({ userEmail: req.params.email });
    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: /api/favorite/addfavorite
router.post("/addfavorite", async (req, res) => {
  try {
    const { userEmail, movieId, movieDetails } = req.body;
    const existing = await Favorite.findOne({ userEmail, movieId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Movie already in favorites" });
    }
    const favorite = new Favorite({ userEmail, movieId, movieDetails });
    await favorite.save();
    res.status(201).json({ success: true, favorite });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE: /api/favorite/removefavorite
router.post("/removefavorite", async (req, res) => {
  try {
    const { userEmail, movieId } = req.body;
    await Favorite.findOneAndDelete({ userEmail, movieId });
    res.json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
