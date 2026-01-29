const sendSMS = async (phoneNumber, message) => {
  try {
    // ✅ FAST2SMS (India)
    if (process.env.SMS_PROVIDER === "fast2sms") {
      const axios = require("axios");

      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          route: "q",
          message,
          language: "english",
          numbers: phoneNumber,
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
          },
        }
      );

      return { success: true, provider: "fast2sms" };
    }

    // ✅ TWILIO (ONLY if explicitly enabled)
    if (process.env.SMS_PROVIDER === "twilio") {
      const twilio = require("twilio");

      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      return { success: true, provider: "twilio" };
    }

    // 🧪 DEV FALLBACK
    console.log(`📱 SMS to ${phoneNumber}: ${message}`);
    return { success: true, provider: "console" };

  } catch (error) {
    console.error("SMS Error:", error.message);
    return { success: false };
  }
};

module.exports = { sendSMS };
