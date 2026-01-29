const express = require("express");
const router = express.Router();

const {
  completeProfile,
  getAvailableEvents,
  registerForEvent,
  getMyRegistrations,
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

/* ================= STUDENT ROUTES ================= */

router.put("/profile", authMiddleware, checkRole("student"), completeProfile);
router.get("/events", authMiddleware, checkRole("student"), getAvailableEvents);
router.post("/register-event/:eventId", authMiddleware, checkRole("student"), registerForEvent);
router.get("/my-registrations", authMiddleware, checkRole("student"), getMyRegistrations);

module.exports = router;
