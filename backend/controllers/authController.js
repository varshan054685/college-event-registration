const User = require("../models/User");
const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "admin123@gmail.com";
const ADMIN_PASSWORD = "admin123";

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ================= REGISTER ================= */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (email === ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin cannot be registered" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({
      name,
      email,
      password,
      role: role === "staff" ? "staff" : "student",
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ===== ADMIN LOGIN ===== */
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken({
        id: "admin",
        role: "admin",
      });

      return res.json({
        _id: "admin",
        role: "admin",
        token,
        profileCompleted: true,
      });
    }

    /* ===== STUDENT / STAFF ===== */
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ===== STAFF LOGIN ===== */
    if (user.role === "staff") {
      return res.json({
        _id: user._id,
        role: user.role,
        token: generateToken({ id: user._id, role: user.role }),
        profileCompleted: user.profileCompleted,
      });
    }

    /* ===== STUDENT OTP ===== */
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();

    console.log("🔐 STUDENT OTP:", otp);

    res.json({
      message: "OTP sent",
      otpRequired: true,
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= VERIFY OTP ================= */
const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isOtpVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({
      _id: user._id,
      role: user.role,
      token: generateToken({ id: user._id, role: user.role }),
      profileCompleted: user.profileCompleted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ME ================= */
const getMe = async (req, res) => {
  // 👑 ADMIN → NO DATABASE
  if (req.user.role === "admin") {
    return res.json({
      _id: "admin",
      name: "Admin",
      email: ADMIN_EMAIL,
      role: "admin",
    });
  }

  // 👤 STUDENT / STAFF
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

module.exports = {
  register,
  login,
  verifyOtp,
  getMe,
};
