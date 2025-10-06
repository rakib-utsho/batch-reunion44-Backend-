const express = require("express");
const authStudent = require("../controllers/authController");

const router = express.Router();

//Register User
router.post("/register", authStudent.registerUser);
//Login User
router.post("/login", authStudent.loginStudent);
//Verify User Account
router.post("/verify_account", authStudent.verifyAccount);
//Resend Verify otp
router.post("/resend-register-otp", authStudent.resendVerifyOtp);
//forget password
router.post("/forget-password", authStudent.forgetPassword);
//verify Reset otp
router.post("/verify-reset-otp", authStudent.verifyResetOtp);
//set new password
router.post("/set-new-password", authStudent.setNewPassword);
//resend reset otp
router.post("/resend-reset-otp", authStudent.resendResetOtp);

module.exports = router;
