const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// @desc    Complete student profile
// @route   PUT /api/student/profile
// @access  Private (Student only)
const completeProfile = async (req, res) => {
  try {
    const { rollNumber, registrationNumber, contactNumber, department, classTeacherId } = req.body;

    if (!rollNumber || !registrationNumber || !contactNumber || !department || !classTeacherId) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Verify class teacher exists and is staff
    const classTeacher = await User.findById(classTeacherId);
    if (!classTeacher || classTeacher.role !== "staff") {
      return res.status(400).json({ message: "Invalid class teacher" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        rollNumber,
        registrationNumber,
        contactNumber,
        department,
        classTeacherId,
        profileCompleted: true,
      },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get events available for student (only if profile completed)
// @route   GET /api/student/events
// @access  Private (Student only)
const getAvailableEvents = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);

    if (!student.profileCompleted) {
      return res.status(403).json({
        message: "Please complete your profile first",
        profileCompleted: false,
      });
    }

    // Get events that match student's department and class
    const events = await Event.find({
      $or: [
        { allowedDepartments: { $in: [student.department] } },
        { allowedClasses: { $in: [student.className] } },
        { allowedDepartments: { $size: 0 } }, // If no restrictions
      ],
      status: { $in: ["upcoming", "ongoing"] },
    })
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for event
// @route   POST /api/student/register-event/:eventId
// @access  Private (Student only)
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const student = await User.findById(req.user._id);

    if (!student.profileCompleted) {
      return res.status(403).json({
        message: "Please complete your profile first",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is available for student
    const isAllowed =
      event.allowedDepartments.length === 0 ||
      event.allowedDepartments.includes(student.department) ||
      event.allowedClasses.includes(student.className);

    if (!isAllowed) {
      return res.status(403).json({ message: "You are not eligible for this event" });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      studentId: req.user._id,
      eventId: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Create registration
    const registration = await Registration.create({
      studentId: req.user._id,
      eventId: eventId,
    });

    // Update event participant count
    event.currentParticipants += 1;
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's registrations
// @route   GET /api/student/my-registrations
// @access  Private (Student only)
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ studentId: req.user._id })
      .populate("eventId")
      .sort({ registeredAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  completeProfile,
  getAvailableEvents,
  registerForEvent,
  getMyRegistrations,
};





