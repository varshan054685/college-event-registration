const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// @desc    Get events available for staff's department
// @route   GET /api/staff/events
// @access  Private (Staff only)
const getStaffEvents = async (req, res) => {
  try {
    const staff = await User.findById(req.user._id);

    // Get events that match staff's department
    const events = await Event.find({
      $or: [
        { allowedDepartments: { $in: [staff.staffDepartment] } },
        { allowedClasses: { $in: [staff.className] } },
        { allowedDepartments: { $size: 0 } },
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

// @desc    Get registrations for a specific event (only staff's class students)
// @route   GET /api/staff/event/:eventId/registrations
// @access  Private (Staff only)
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const staff = await User.findById(req.user._id);

    // Get all students in staff's class
    const students = await User.find({
      classTeacherId: req.user._id,
      role: "student",
    });

    const studentIds = students.map((s) => s._id);

    // Get registrations for this event and these students
    const registrations = await Registration.find({
      eventId: eventId,
      studentId: { $in: studentIds },
      status: "registered",
    })
      .populate("studentId", "name rollNumber registrationNumber contactNumber")
      .populate("eventId", "title date venue")
      .sort({ registeredAt: -1 });

    res.json({
      event: await Event.findById(eventId),
      registrations,
      count: registrations.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a student for an event
// @route   POST /api/staff/register-student
// @access  Private (Staff only)
const registerStudent = async (req, res) => {
  try {
    const { studentId, eventId } = req.body;
    const staff = await User.findById(req.user._id);

    // Verify student is in staff's class
    const student = await User.findById(studentId);
    if (!student || student.classTeacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only register students from your class",
      });
    }

    // Check if student profile is completed
    if (!student.profileCompleted) {
      return res.status(400).json({
        message: "Student profile is not completed",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      studentId: studentId,
      eventId: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Student already registered for this event" });
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Create registration
    const registration = await Registration.create({
      studentId: studentId,
      eventId: eventId,
      staffId: req.user._id,
    });

    // Update event participant count
    event.currentParticipants += 1;
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students in staff's class
// @route   GET /api/staff/my-students
// @access  Private (Staff only)
const getMyStudents = async (req, res) => {
  try {
    const students = await User.find({
      classTeacherId: req.user._id,
      role: "student",
    }).select("-password");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStaffEvents,
  getEventRegistrations,
  registerStudent,
  getMyStudents,
};





