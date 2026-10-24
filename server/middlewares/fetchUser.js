const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "imovies_super_secret_jwt_key_2026";

const fetchUser = (req, res, next) => {
  // Get token from header 'auth-token' or 'Authorization' Bearer
  const token = req.header("auth-token") || (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));

  if (!token) {
    return res.status(401).json({ success: false, error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token, please authenticate" });
  }
};

module.exports = fetchUser;
