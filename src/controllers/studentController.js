const StudentModel = require("../models/Student.model");

// Get student profile
async function getMe(req, res) {
  try {
    const student = await StudentModel.findById(req.student._id).select(
      "-password"
    );
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        student,
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

    if (updateFields.socialLinks) {
      const { github, linkedin, facebook, twitter, portfolio } =
        updateFields.socialLinks;

      updateFields.socialLinks = {
        github,
        linkedin,
        facebook,
        twitter,
        portfolio,
      };
    }

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
  getMe,
  updateProfile,
  getAllStudents,
  getStudentById,
};
