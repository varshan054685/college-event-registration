const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEventStats,
  getAllEvents,
  createStaff,
  getAllStaff,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

/* ================= ADMIN PROTECTED ROUTES ================= */

router.post("/create-event", authMiddleware, checkRole("admin"), createEvent);
router.get("/event-stats/:eventId", authMiddleware, checkRole("admin"), getEventStats);
router.get("/events", authMiddleware, checkRole("admin"), getAllEvents);
router.post("/create-staff", authMiddleware, checkRole("admin"), createStaff);
router.get("/staff", authMiddleware, checkRole("admin"), getAllStaff);

module.exports = router;
