const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

/* ================= CREATE EVENT ================= */
const createEvent = async (req, res) => {
  try {
    const requiredFields = [
      "title",
      "description",
      "date",
      "time",
      "venue",
      "maxParticipants",
      "category",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `${field} is required`,
        });
      }
    }

    const event = await Event.create({
      ...req.body,
      allowedDepartments: req.body.allowedDepartments || [],
      allowedClasses: req.body.allowedClasses || [],
      createdBy: req.user.role === "admin" ? "admin" : req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= EVENT STATS ================= */
const getEventStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const totalRegistrations = await Registration.countDocuments({
      eventId,
      status: "registered",
    });

    const availableSlots = Math.max(
      event.maxParticipants - totalRegistrations,
      0
    );

    res.json({
      event,
      totalRegistrations,
      maxParticipants: event.maxParticipants,
      availableSlots,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ADMIN EVENTS ================= */
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: "admin",
    }).sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CREATE STAFF ================= */
const createStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      staffId,
      staffDepartment,
      className,
      phone,
    } = req.body;

    if (!name || !email || !password || !staffId || !staffDepartment || !className) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (await User.findOne({ staffId })) {
      return res.status(400).json({ message: "Staff ID already exists" });
    }

    const staff = await User.create({
      name,
      email,
      password,
      role: "staff",
      staffId,
      staffDepartment,
      className,
      phone: phone || null,
      profileCompleted: true,
    });

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      staffId: staff.staffId,
      staffDepartment: staff.staffDepartment,
      className: staff.className,
      phone: staff.phone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL STAFF ================= */
const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("-password");
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getEventStats,
  getAllEvents,
  createStaff,
  getAllStaff,
};
