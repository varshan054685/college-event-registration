const express = require("express");
const router = express.Router();

const { sendEventDaySMS } = require("../services/smsService");
const authMiddleware = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

/* ================= SMS / NOTIFICATIONS ================= */

// Trigger SMS for event day (Admin only)
router.post(
  "/send-event-sms/:eventId",
  authMiddleware,
  checkRole("admin"),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const result = await sendEventDaySMS(eventId);

      if (result.success) {
        res.json({ message: "SMS sent successfully", result });
      } else {
        res.status(500).json({ message: "Failed to send SMS", error: result.error });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
