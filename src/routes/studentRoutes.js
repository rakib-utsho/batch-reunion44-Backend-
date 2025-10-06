const express = require("express");
const authStudent = require("../controllers/authController");
const student = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

// Import the multer Cloudinary parser for file upload
const parser = require("../utils/fileUploader");

const router = express.Router();

//get profile
router.get("/getMe", authMiddleware.protect, student.getMe);
//update profile
router.put(
  "/updateProfile",
  authMiddleware.protect,
  parser.single("profileImage"),
  student.updateProfile
);
// admin / general routes
router.get("/all_students", student.getAllStudents);
router.get("/student/:id", student.getStudentById);

module.exports = router;
