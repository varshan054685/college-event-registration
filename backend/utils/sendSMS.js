const axios = require("axios");

const sendSMS = async (phone, otp) => {
  try {
    if (!phone) throw new Error("Phone number missing");

    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        variables_values: otp,
        numbers: phone,
      },
      {
        headers: { authorization: process.env.FAST2SMS_API_KEY },
      }
    );

    console.log("📱 SMS sent to:", phone);
    return true;
  } catch (error) {
    console.error("❌ SMS send error:", error.message);
    return false;
  }
};

module.exports = sendSMS;
