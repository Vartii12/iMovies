const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const fetchUser = require("../middlewares/fetchUser");

const JWT_SECRET = process.env.JWT_SECRET || "imovies_super_secret_jwt_key_2026";

// POST: /api/auth/admin/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ user: { id: admin._id, email: admin.email, username: admin.username, role: "admin" } }, JWT_SECRET);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email, role: "admin" },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: /api/auth/admin/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid admin credentials" });
    }

    const token = jwt.sign({ user: { id: admin._id, email: admin.email, username: admin.username, role: "admin" } }, JWT_SECRET);

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email, role: "admin" },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: /api/auth/admin/getadmin
router.get("/getadmin", fetchUser, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
