const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");

const authMiddleware = async (req, res, next) => {
  try {
    /* ================= GET TOKEN ================= */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    /* ================= VERIFY TOKEN ================= */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ================= ADMIN (NO DB HIT) ================= */
    if (decoded.role === "admin") {
      req.user = {
        id: "admin",
        role: "admin",
      };
      return next();
    }

    /* ================= VALIDATE USER ID ================= */
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    /* ================= FETCH USER ================= */
    const user = await User.findById(decoded.id).select(
      "-password -otp -otpExpiresAt"
    );

    if (!user) {
      return res.status(401).json({
        message: "User account not found",
      });
    }

    /* ================= OTP CHECK (STUDENTS ONLY) ================= */
    if (user.role === "student" && !user.isOtpVerified) {
      return res.status(401).json({
        message: "OTP verification required",
      });
    }

    /* ================= ATTACH USER ================= */
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;