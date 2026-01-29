const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

/* =========================
   GET EVENTS FOR STAFF
   ========================= */
const getStaffEvents = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Access denied" });
    }

    const events = await Event.find({
      $or: [
        { allowedDepartments: { $in: [req.user.staffDepartment] } },
        { allowedClasses: { $in: [req.user.className] } },
        { allowedDepartments: { $size: 0 } }, // open for all
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
   GET EVENT REGISTRATIONS (STAFF CLASS ONLY)
   ========================= */
const getEventRegistrations = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { eventId } = req.params;

    const students = await User.find({
      classTeacherId: req.user._id,
      role: "student",
    }).select("_id");

    const studentIds = students.map((s) => s._id);

    const registrations = await Registration.find({
      eventId,
      studentId: { $in: studentIds },
    })
      .populate("studentId", "name rollNumber registrationNumber contactNumber")
      .populate("eventId", "title date venue")
      .sort({ createdAt: -1 });

    res.json({
      event: await Event.findById(eventId),
      registrations,
      count: registrations.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   REGISTER STUDENT BY STAFF
   ========================= */
const registerStudent = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { studentId, eventId } = req.body;

    const student = await User.findById(studentId);
    if (
      !student ||
      student.role !== "student" ||
      student.classTeacherId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only register students from your class",
      });
    }

    if (!student.profileCompleted) {
      return res.status(400).json({
        message: "Student profile is not completed",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingRegistration = await Registration.findOne({
      studentId,
      eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "Student already registered for this event",
      });
    }

    if ((event.currentParticipants || 0) >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    const registration = await Registration.create({
      studentId,
      eventId,
      registeredBy: "staff",
      staffId: req.user._id,
    });

    event.currentParticipants = (event.currentParticipants || 0) + 1;
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET MY STUDENTS
   ========================= */
const getMyStudents = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Access denied" });
    }

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
