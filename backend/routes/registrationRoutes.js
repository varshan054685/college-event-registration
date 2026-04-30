const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/registrations — register for an event
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, additionalInfo } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status === 'cancelled') return res.status(400).json({ message: 'Event is cancelled' });
    if (event.registeredCount >= event.capacity) return res.status(400).json({ message: 'Event is full' });

    const existing = await Registration.findOne({ user: req.user._id, event: eventId });
    if (existing) return res.status(400).json({ message: 'Already registered for this event' });

    const registration = await Registration.create({
      user: req.user._id,
      event: eventId,
      additionalInfo,
      paymentStatus: event.price === 0 ? 'free' : 'pending',
    });

    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { registeredEvents: eventId } });

    await registration.populate('event', 'title date venue image');
    res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already registered for this event' });
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/registrations/:id — cancel registration
router.delete('/:id', protect, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    if (reg.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await Event.findByIdAndUpdate(reg.event, { $inc: { registeredCount: -1 } });
    await User.findByIdAndUpdate(reg.user, { $pull: { registeredEvents: reg.event } });
    await reg.deleteOne();

    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/registrations/my — user's registrations
router.get('/my', protect, async (req, res) => {
  const regs = await Registration.find({ user: req.user._id })
    .populate('event', 'title date venue image category status')
    .sort({ createdAt: -1 });
  res.json(regs);
});

// GET /api/registrations/check/:eventId — check if registered
router.get('/check/:eventId', protect, async (req, res) => {
  const reg = await Registration.findOne({ user: req.user._id, event: req.params.eventId });
  res.json({ registered: !!reg, registration: reg });
});

// GET /api/registrations (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  const regs = await Registration.find()
    .populate('user', 'name email college')
    .populate('event', 'title date')
    .sort({ createdAt: -1 });
  res.json(regs);
});

module.exports = router;
