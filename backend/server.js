const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files (if you use multer later)
app.use("/uploads", express.static("uploads"));

// ================== DATABASE ==================
const connectDB = require("./config/db");
connectDB();

// ================== ROUTES ==================

// Auth (login, register, OTP)
app.use("/api/auth", require("./routes/authRoutes"));

// Student routes
app.use("/api/student", require("./routes/studentRoutes"));

// Staff / Faculty routes
app.use("/api/staff", require("./routes/staffRoutes"));

// Admin routes
app.use("/api/admin", require("./routes/adminRoutes"));

// SMS routes (Fast2SMS)
app.use("/api/sms", require("./routes/smsRoutes"));

// Event routes
app.use("/api/events", require("./routes/eventRoutes"));

// ================== TEST ROUTE ==================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "College Event Registration API is running 🚀",
  });
});

// ================== 404 HANDLER ==================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ================== GLOBAL ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
