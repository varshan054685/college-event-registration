const Event = require("../models/Event");
const Registration = require("../models/Registration");

/* =========================
   GET ALL EVENTS (PUBLIC)
   ========================= */
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET SINGLE EVENT (PUBLIC)
   ========================= */
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CREATE EVENT (ADMIN / FACULTY)
   ========================= */
const createEvent = async (req, res) => {
  try {
    let brochure = null;

    // 📎 Handle brochure upload (PDF / Image)
    if (req.file) {
      brochure = `/uploads/brochures/${req.file.filename}`;
    }

    const event = await Event.create({
      ...req.body,
      brochure,              // ✅ brochure saved
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE EVENT (ADMIN / CREATOR)
   ========================= */
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Admin OR faculty who created the event
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 📎 Update brochure if uploaded
    if (req.file) {
      req.body.brochure = `/uploads/brochures/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE EVENT (ADMIN / CREATOR)
   ========================= */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await event.deleteOne();
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   REGISTER FOR EVENT (STUDENT)
   ========================= */
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingRegistration = await Registration.findOne({
      studentId: req.user._id,
      eventId: req.params.id,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered" });
    }

    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    const registration = await Registration.create({
      studentId: req.user._id,
      eventId: req.params.id,
    });

    event.currentParticipants += 1;
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET MY REGISTRATIONS
   ========================= */
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      studentId: req.user._id,
    })
      .populate("eventId")
      .sort({ registeredAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getMyRegistrations,
};
