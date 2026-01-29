const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📁 Ensure upload directory exists
const uploadDir = "uploads/brochures";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📦 Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// 🛡️ File filter (PDF + Images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF, JPG, JPEG, and PNG files are allowed"),
      false
    );
  }
};

// 🚀 Multer middleware
const uploadBrochure = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = uploadBrochure;
