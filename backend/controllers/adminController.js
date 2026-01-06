const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// @desc    Create a new event
// @route   POST /api/admin/create-event
// @access  Private (Admin only)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      venue,
      maxParticipants,
      category,
      allowedDepartments,
      allowedClasses,
    } = req.body;

    if (!title || !description || !date || !time || !venue || !maxParticipants || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      maxParticipants,
      category,
      allowedDepartments: allowedDepartments || [],
      allowedClasses: allowedClasses || [],
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event statistics
// @route   GET /api/admin/event-stats/:eventId
// @access  Private (Admin only)
const getEventStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const totalRegistrations = await Registration.countDocuments({
      eventId: eventId,
      status: "registered",
    });

    res.json({
      event,
      totalRegistrations,
      maxParticipants: event.maxParticipants,
      availableSlots: event.maxParticipants - totalRegistrations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events created by admin
// @route   GET /api/admin/events
// @access  Private (Admin only)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create staff account
// @route   POST /api/admin/create-staff
// @access  Private (Admin only)
const createStaff = async (req, res) => {
  try {
    const { name, email, password, staffId, staffDepartment, className, phone } = req.body;

    if (!name || !email || !password || !staffId || !staffDepartment || !className) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if staffId is unique
    const staffIdExists = await User.findOne({ staffId });
    if (staffIdExists) {
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
      phone,
    });

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      staffId: staff.staffId,
      staffDepartment: staff.staffDepartment,
      className: staff.className,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all staff
// @route   GET /api/admin/staff
// @access  Private (Admin only)
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





