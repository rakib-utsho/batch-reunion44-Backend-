const StudentModel = require("../models/Student.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const parser = require("../utils/fileUploader");
const { generateOtp, hashOtp, verifyOtp } = require("../utils/generateOtp");
const { sendEmail } = require("../utils/mailer");
const {
  verificationEmail,
  resetPasswordEmail,
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
      verificationEmail(otp, "account verification")
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
      resetPasswordEmail(otp, "password reset")
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

//get the profile
async function getMe(req, res) {
  try {
    const student = await StudentModel.findById(req.student._id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          intake: student.intake,
          section: student.section,
          profileImage: student.profileImage,
          location: student.location,
          higherEducation: student.higherEducation,
          jobInfo: student.jobInfo,
          isProfileComplete: student.isProfileComplete,
          isAdmin: student.isAdmin,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//update student profile
async function updateProfile(req, res) {
  try {
    const updateFields = req.body.data ? JSON.parse(req.body.data) : {};

    // If file uploaded, get URL from Cloudinary
    if (req.file && req.file.path) {
      updateFields.profileImage = req.file.path;
    }
    // Always mark profile complete

    updateFields.isProfileComplete = true;

    const student = await StudentModel.findByIdAndUpdate(
      req.student._id,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { student },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// GET ALL STUDENTS with Pagination
async function getAllStudents(req, res) {
  try {
    // query params ?page=1&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    //search filters
    const { name, studentId, location, jobTitle, degree } = req.query;

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // case-insensitive search
    }

    if (studentId) {
      filter.studentId = { $regex: studentId, $options: "i" };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (jobTitle) {
      filter["jobInfo.jobTitle"] = { $regex: jobTitle, $options: "i" };
    }

    if (degree) {
      filter["higherEducation.degree"] = { $regex: degree, $options: "i" };
    }

    const totalStudents = await StudentModel.countDocuments(filter);
    const students = await StudentModel.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      meta: {
        total: totalStudents,
        page,
        limit,
        totalPages: Math.ceil(totalStudents / limit),
        hasNextPage: page * limit < totalStudents,
        hasPrevPage: page > 1,
      },
      data: students,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// GET STUDENT BY ID
async function getStudentById(req, res) {
  try {
    const { id } = req.params;

    const student = await StudentModel.findById(id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  registerUser,
  loginStudent,
  verifyAccount,
  forgetPassword,
  verifyResetOtp,
  setNewPassword,
  getMe,
  updateProfile,
  getAllStudents,
  getStudentById,
};
