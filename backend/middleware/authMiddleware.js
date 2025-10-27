const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET = "harshchavada";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res
      .status(401)
      .json({ message: "Not authorized, token failed or expired" });
  }
};

module.exports = authMiddleware;
