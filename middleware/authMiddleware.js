
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Protect route (check token)
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");

    // Get full user from DB
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Token not valid" });
  }
};

// Role authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to do this",
      });
    }
    next();
  };
};