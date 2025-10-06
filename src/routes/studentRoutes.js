const express = require("express");
const authStudent = require("../controllers/authController");
const student = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");
// Import the multer Cloudinary parser
const parser = require("../utils/fileUploader");

const router = express.Router();

//auth
router.post("/register", authStudent.registerUser);
router.post("/login", authStudent.loginStudent);
router.post("/verify_account", authStudent.verifyAccount);
router.post("/resend-register-otp", authStudent.resendVerifyOtp);
router.post("/forget-password", authStudent.forgetPassword);
router.post("/verify-reset-otp", authStudent.verifyResetOtp);
router.post("/set-new-password", authStudent.setNewPassword);
router.post("/resend-reset-otp", authStudent.resendResetOtp);

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
