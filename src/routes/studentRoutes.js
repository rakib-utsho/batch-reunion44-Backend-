const express = require("express");
const authStudent = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
// Import the multer Cloudinary parser
const parser = require("../utils/fileUploader");

const router = express.Router();

//auth
router.post("/register", authStudent.registerUser);
router.post("/login", authStudent.loginStudent);
router.post("/verify_account", authStudent.verifyAccount);

//get profile
router.get("/getMe", authMiddleware.protect, authStudent.getMe);

//update profile
router.put(
  "/updateProfile",
  authMiddleware.protect,
  parser.single("profileImage"),
  authStudent.updateProfile
);

// admin / general routes
router.get("/all_students", authStudent.getAllStudents);
router.get("/student/:id", authStudent.getStudentById);

module.exports = router;
