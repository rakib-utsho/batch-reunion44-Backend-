const StudentModel = require("../models/Student.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const parser = require("../utils/fileUploader");
const { generateOtp, hashOtp, verifyOtp } = require("../utils/generateOtp");
const { sendEmail } = require("../utils/mailer");
const {
  verificationEmail,
  resetPasswordEmail,
  welcomeEmail,
} = require("../utils/emailtemplete");

// register user controller
async function registerUser(req, res) {
  try {
    const { name, email, password, studentId, intake, section, phone } =
      req.body;

    const userExists = await StudentModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);

    const student = await StudentModel.create({
      name,
      email,
      password: hashedPassword,
      studentId,
      intake,
      section,
      phone,
      otp: hashedOtp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendEmail(
      email,
      "Verify your account - OTP",
      verificationEmail(name, otp)
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        intake: student.intake,
        otp: student.otp,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ========== VERIFY REGISTER OTP ==========
async function verifyAccount(req, res) {
  try {
    const { email, otp } = req.body;
    const student = await StudentModel.findOne({ email });

    if (!student.otp || student.otpExpires < Date.now())
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or invalid" });

    const isValid = await verifyOtp(otp, student.otp);
    if (!isValid)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    student.isVerified = true;
    student.otp = null;
    student.otpExpires = null;
    await student.save();

    await sendEmail(
      email,
      "Welcome Home, Graduate of Batch 44!",
      welcomeEmail(student.name)
    );

    return res
      .status(200)
      .json({ success: true, message: "Account verified successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

//login user controller
async function loginStudent(req, res) {
  const { email, password } = req.body;

  const student = await StudentModel.findOne({ email }).select("+password");

  if (!student) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, student.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.cookie("token", token);

  return res.status(200).json({
    success: true,
    message: "User Login Successfully",
    data: {
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        intake: student.intake,
        section: student.section,
      },
      token,
    },
  });
}

//========FORGET Password (Send OTP)==========

async function forgetPassword(req, res) {
  try {
    const { email } = req.body;
    const student = await StudentModel.findOne({ email });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const otp = generateOtp();
    student.resetPasswordOTP = await hashOtp(otp);
    student.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await student.save();

    await sendEmail(
      email,
      "Reset Password OTP",
      resetPasswordEmail(student.name, otp)
    );

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ========== VERIFY RESET PASSWORD OTP ==========
async function verifyResetOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const student = await Student.findOne({ email });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "No account found with this email" });

    if (!student.resetPasswordOTP || student.resetPasswordExpires < Date.now())
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or invalid" });

    const isValid = await verifyOtp(otp, student.resetPasswordOTP);
    if (!isValid)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    // mark verified temporarily
    student.resetPasswordOTP = "VERIFIED";
    await student.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now set a new password.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ========== SET NEW PASSWORD ==========
async function setNewPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    const student = await Student.findOne({ email });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "No account found with this email" });

    if (student.resetPasswordOTP !== "VERIFIED")
      return res.status(400).json({
        success: false,
        message: "Please verify OTP first before setting new password",
      });

    const hashed = await bcrypt.hash(newPassword, 10);
    student.password = hashed;
    student.resetPasswordOTP = null;
    student.resetPasswordExpires = null;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

//resend verify otp
async function resendVerifyOtp(req, res) {
  try {
    const { email } = req.body;
    const student = await StudentModel.findOne({ email });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (student.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }

    const otp = generateOtp();
    student.otp = await hashOtp(otp);
    student.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await student.save();

    await sendEmail(
      email,
      "Resend Verification OTP",
      verificationEmail(student.name, otp)
    );

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully. Please check your email.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ======== RESEND RESET PASSWORD OTP =========
async function resendResetOtp(req, res) {
  try {
    const { email } = req.body;
    const student = await StudentModel.findOne({ email });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = generateOtp();
    student.resetPasswordOTP = await hashOtp(otp);
    student.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await student.save();

    await sendEmail(
      email,
      "Resend Reset Password OTP",
      resetPasswordEmail(student.name, otp)
    );

    return res.status(200).json({
      success: true,
      message: "Reset OTP resent successfully. Please check your email.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  registerUser,
  loginStudent,
  verifyAccount,
  forgetPassword,
  verifyResetOtp,
  setNewPassword,
  resendVerifyOtp,
  resendResetOtp,
};
