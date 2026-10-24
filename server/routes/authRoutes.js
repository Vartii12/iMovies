const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const fetchUser = require("../middlewares/fetchUser");

const JWT_SECRET = process.env.JWT_SECRET || "imovies_super_secret_jwt_key_2026";

// POST: /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email or username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ user: { id: user._id, email: user.email, username: user.username, role: "user" } }, JWT_SECRET);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: "user" },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ user: { id: user._id, email: user.email, username: user.username, role: "user" } }, JWT_SECRET);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: "user" },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: /api/auth/getuser
router.get("/getuser", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: /api/auth/update
router.put("/update", fetchUser, async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { username }, { new: true }).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
