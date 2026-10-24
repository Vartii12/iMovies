const express = require("express");
const router = express.Router();
const Movie = require("../models/movieModel");
const fetchUser = require("../middlewares/fetchUser");

// GET: /api/movie/getmovies
router.get("/getmovies", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseDate: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: /api/movie/getmovie/:id
router.get("/getmovie/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: /api/movie/addmovie
router.post("/addmovie", async (req, res) => {
  try {
    const { movieName, description, genres, releaseDate, runtime, certification, media } = req.body;
    const movie = new Movie({
      movieName,
      description,
      genres,
      releaseDate: new Date(releaseDate),
      runtime: runtime || 120,
      certification: certification || "U/A",
      media: media || "",
    });
    await movie.save();
    res.status(201).json({ success: true, movie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE: /api/movie/deletemovie/:id
router.delete("/deletemovie/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: /api/movie/updatemovie/:id
router.put("/updatemovie/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.json({ success: true, movie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
