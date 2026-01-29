const express = require('express');
const router = express.Router();

const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getMyRegistrations,
} = require('../controllers/eventController');

const authMiddleware = require('../middleware/authMiddleware');

/* ================= PUBLIC ROUTES ================= */
router.get('/', getEvents);
router.get('/:id', getEvent);

/* ================= PROTECTED ROUTES ================= */
router.post('/', authMiddleware, createEvent);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.post('/:id/register', authMiddleware, registerForEvent);
router.get('/my-registrations/all', authMiddleware, getMyRegistrations);

module.exports = router;
