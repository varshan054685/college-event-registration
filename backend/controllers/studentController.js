const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

/* =========================
   COMPLETE STUDENT PROFILE
   ========================= */
const completeProfile = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      rollNumber,
      registrationNumber,
      contactNumber,
      department,
      classTeacherId,
    } = req.body;

    if (!rollNumber || !registrationNumber || !contactNumber || !department || !classTeacherId) {
      return res.status(400).json({ message: "All fields are required" });
    }

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

/* =========================
   GET AVAILABLE EVENTS
   ========================= */
const getAvailableEvents = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await User.findById(req.user._id);
    if (!student.profileCompleted) {
      return res.status(403).json({
        message: "Please complete your profile first",
        profileCompleted: false,
      });
    }

    const staff = await User.findById(student.classTeacherId);

    const events = await Event.find({
      $or: [
        { allowedDepartments: { $in: [student.department] } },
        staff ? { allowedClasses: { $in: [staff.className] } } : {},
        { allowedDepartments: { $size: 0 } },
      ],
    })
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   REGISTER FOR EVENT
   ========================= */
const registerForEvent = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

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

    const staff = await User.findById(student.classTeacherId);

    const isAllowed =
      event.allowedDepartments.length === 0 ||
      event.allowedDepartments.includes(student.department) ||
      (staff && event.allowedClasses.includes(staff.className));

    if (!isAllowed) {
      return res.status(403).json({
        message: "You are not eligible for this event",
      });
    }

    const existingRegistration = await Registration.findOne({
      studentId: req.user._id,
      eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered" });
    }

    if ((event.currentParticipants || 0) >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    const registration = await Registration.create({
      studentId: req.user._id,
      eventId,
      registeredBy: "student",
    });

    event.currentParticipants = (event.currentParticipants || 0) + 1;
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   MY REGISTRATIONS
   ========================= */
const getMyRegistrations = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const registrations = await Registration.find({
      studentId: req.user._id,
    })
      .populate("eventId")
      .sort({ createdAt: -1 });

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
