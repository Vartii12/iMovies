const express = require("express");
const router = express.Router();
const Review = require("../models/reviewModel");

// GET: /api/review/getreviews/:movieId
router.get("/getreviews/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: /api/review/addreview
router.post("/addreview", async (req, res) => {
  try {
    const { userEmail, username, movieId, rating, comment } = req.body;
    const review = new Review({
      userEmail,
      username: username || userEmail.split("@")[0],
      movieId,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
