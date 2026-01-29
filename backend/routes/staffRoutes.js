const express = require("express");
const router = express.Router();

const {
  getStaffEvents,
  getEventRegistrations,
  registerStudent,
  getMyStudents,
} = require("../controllers/staffController");

const authMiddleware = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

/* ================= STAFF ROUTES ================= */

router.get("/events", authMiddleware, checkRole("staff"), getStaffEvents);
router.get("/event/:eventId/registrations", authMiddleware, checkRole("staff"), getEventRegistrations);
router.post("/register-student", authMiddleware, checkRole("staff"), registerStudent);
router.get("/my-students", authMiddleware, checkRole("staff"), getMyStudents);

module.exports = router;
