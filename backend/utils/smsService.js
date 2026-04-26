const twilio = require('twilio');

// Initialize Twilio client only if credentials exist
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (error) {
    console.error('⚠️ Twilio initialization failed:', error.message);
  }
}

/**
 * Send an OTP via SMS
 */
const sendOTP = async (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  if (!client) {
    console.log(`[MOCK SMS] OTP for ${phone}: ${otp}`);
    return otp;
  }

  try {
    await client.messages.create({
      body: `ParkSmart AI: Your OTP is ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: `+91${phone}`
    });
  } catch (error) {
    console.error(`⚠️ Twilio SMS failed to ${phone}:`, error.message);
  }

  return otp; 
};

/**
 * Send Visitor Entry Alert to Resident
 */
const sendEntryAlert = async (residentPhone, visitorName, vehicle) => {
  if (!client) {
    console.log(`[MOCK SMS] Entry Alert to ${residentPhone}: ${visitorName} entered with ${vehicle}`);
    return;
  }

  try {
    await client.messages.create({
      body: `ParkSmart: ${visitorName} (${vehicle}) has entered your society. Time: ${new Date().toLocaleTimeString('en-IN')}`,
      from: process.env.TWILIO_PHONE,
      to: `+91${residentPhone}`
    });
  } catch (error) {
    console.error(`⚠️ Twilio SMS failed to ${residentPhone}:`, error.message);
  }
};

/**
 * Send Overstay Alert
 */
const sendOverstayAlert = async (residentPhone, visitorName, duration) => {
  if (!client) {
    console.log(`[MOCK SMS] Overstay Alert to ${residentPhone}: ${visitorName} overstayed by ${duration} mins`);
    return;
  }

  try {
    await client.messages.create({
      body: `ParkSmart ALERT: Your visitor ${visitorName} has been inside for ${duration} minutes. Please check.`,
      from: process.env.TWILIO_PHONE,
      to: `+91${residentPhone}`
    });
  } catch (error) {
    console.error(`⚠️ Twilio SMS failed to ${residentPhone}:`, error.message);
  }
};

module.exports = { sendOTP, sendEntryAlert, sendOverstayAlert };
