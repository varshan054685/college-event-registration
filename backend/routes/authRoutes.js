const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyOtp,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);

// Protected
router.get("/me", authMiddleware, getMe);

module.exports = router;



