const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "admin", "staff"],
      default: "student",
    },

    /* ================= STUDENT FIELDS ================= */
    rollNumber: {
      type: String,
      trim: true,
    },
    registrationNumber: {
      type: String,
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
      trim: true,
      unique: true,
      sparse: true,
    },
    staffDepartment: {
      type: String,
      trim: true,
    },
    className: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    /* ================= OTP FIELDS ================= */
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
  {
    timestamps: true,
  }
);

/* ========== HASH PASSWORD BEFORE SAVE ========== */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ========== COMPARE PASSWORD ========== */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
