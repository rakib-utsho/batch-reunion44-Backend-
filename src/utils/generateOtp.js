// utils/generateOtp.js
const bcrypt = require("bcryptjs");

exports.generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.hashOtp = async (otp) => await bcrypt.hash(otp, 10);

exports.verifyOtp = async (otp, hashedOtp) =>
  await bcrypt.compare(otp, hashedOtp);
