const crypto = require("crypto");

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
}

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

module.exports = { generateOtp, hashOtp };
