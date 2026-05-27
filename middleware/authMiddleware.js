const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const dotenv = require("dotenv");
dotenv.config();

exports.protect = async (req, res, next) => {
  try {
    const authheader = req.headers.authorization;
    if (!authheader || !authheader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ message: "Unathorized: No Token provided" });
    }
    const token = authheader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unathorized: Not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unathorized: Invalid token", error: error.message });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admins Only" });
  }
};
