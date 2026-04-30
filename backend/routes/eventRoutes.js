const express = require('express');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const { category, status, search, featured, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status) filter.status = status;
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [events, total] = await Promise.all([
      Event.find(filter).sort({ isFeatured: -1, date: 1 }).skip(skip).limit(Number(limit)).populate('createdBy', 'name'),
      Event.countDocuments(filter),
    ]);

    res.json({ events, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/featured
router.get('/featured', async (req, res) => {
  const events = await Event.find({ isFeatured: true, status: { $ne: 'cancelled' } }).limit(4).sort({ date: 1 });
  res.json(events);
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch {
    res.status(404).json({ message: 'Event not found' });
  }
});

// POST /api/events (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/events/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/events/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await Registration.deleteMany({ event: req.params.id });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id/registrations (admin)
router.get('/:id/registrations', protect, adminOnly, async (req, res) => {
  const regs = await Registration.find({ event: req.params.id }).populate('user', 'name email college year');
  res.json(regs);
});

module.exports = router;
