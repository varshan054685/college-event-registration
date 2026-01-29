const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      required: false,
      trim: true,
    },

    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      default: "student",
    },

    /* ================= STUDENT FIELDS ================= */
    rollNumber: {
      type: String,
      sparse: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      sparse: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    classTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    /* ================= STAFF FIELDS ================= */
    staffId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    staffDepartment: {
      type: String,
      trim: true,
    },

    className: {
      type: String,
      trim: true,
    },

    /* ================= OTP LOGIN ================= */
    otp: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
    },

    isOtpVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* 🔐 Hash password */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* 🔑 Compare password */
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
