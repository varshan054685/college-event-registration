// SMS Service for sending notifications to staff
// Supports Twilio and Fast2SMS

const sendSMS = async (phoneNumber, message) => {
  try {
    // Option 1: Twilio (International)
    if (process.env.SMS_PROVIDER === "twilio") {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require("twilio")(accountSid, authToken);

      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      return { success: true, provider: "twilio" };
    }

    // Option 2: Fast2SMS (India)
    if (process.env.SMS_PROVIDER === "fast2sms") {
      const axios = require("axios");
      const url = "https://www.fast2sms.com/dev/bulkV2";

      const response = await axios.post(
        url,
        {
          route: "q",
          message: message,
          language: "english",
          numbers: phoneNumber,
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
          },
        }
      );

      return { success: true, provider: "fast2sms", data: response.data };
    }

    // Fallback: Console log (for development)
    console.log(`SMS to ${phoneNumber}: ${message}`);
    return { success: true, provider: "console" };
  } catch (error) {
    console.error("SMS sending error:", error);
    return { success: false, error: error.message };
  }
};

// @desc    Send SMS to staff with their class students list
// @route   Internal function (called by cron job or manual trigger)
const sendEventDaySMS = async (eventId) => {
  try {
    const Event = require("../models/Event");
    const User = require("../models/User");
    const Registration = require("../models/Registration");

    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Get all staff members
    const allStaff = await User.find({ role: "staff" });

    for (const staff of allStaff) {
      // Get students in staff's class who registered for this event
      const students = await User.find({
        classTeacherId: staff._id,
        role: "student",
      });

      const studentIds = students.map((s) => s._id);

      const registrations = await Registration.find({
        eventId: eventId,
        studentId: { $in: studentIds },
        status: "registered",
      }).populate("studentId", "name rollNumber");

      if (registrations.length > 0 && staff.phone) {
        let message = `Event: ${event.title}\nDate: ${event.date}\nVenue: ${event.venue}\n\nStudents attending:\n`;

        registrations.forEach((reg, index) => {
          message += `${index + 1}. ${reg.studentId.name} (${reg.studentId.rollNumber})\n`;
        });

        await sendSMS(staff.phone, message);
      }
    }

    return { success: true, message: "SMS sent to all staff" };
  } catch (error) {
    console.error("Event day SMS error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendSMS,
  sendEventDaySMS,
};





