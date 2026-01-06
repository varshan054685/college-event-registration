const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    currentParticipants: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },

    allowedDepartments: {
      type: [String],
      default: [],
    },

    allowedClasses: {
      type: [String],
      default: [],
    },

    // 📌 NEW: Brochure details
    brochure: {
      fileName: String,
      fileUrl: String,
      fileType: String,
    },

    // 📌 Admin / Faculty who created event
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdByRole: {
      type: String,
      enum: ["admin", "staff"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
