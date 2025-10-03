const StudentModel = require("../models/Student.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const parser = require("../utils/fileUploader");

// register user controller
async function registerUser(req, res) {
  const { name, email, password, studentId, intake, section } = req.body;

  const userExists = await StudentModel.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await StudentModel.create({
    name,
    email,
    password: hashedPassword,
    studentId,
    intake,
    section,
  });

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.cookie("token", token);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
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

//update profile
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

module.exports = {
  registerUser,
  loginStudent,
  getMe,
  updateProfile,
};
