const express = require("express");
const authStudent = require("../controllers/authController");

const router = express.Router();

//Register User
router.post("/auth/register", authStudent.registerUser);
//Login User
router.post("/auth/login", authStudent.loginStudent);
//Verify User Account
router.post("/auth/verify_account", authStudent.verifyAccount);
//Resend Verify otp
router.post("/auth/resend-register-otp", authStudent.resendVerifyOtp);
//forget password
router.post("/auth/forget-password", authStudent.forgetPassword);
//verify Reset otp
router.post("/auth/verify-reset-otp", authStudent.verifyResetOtp);
//set new password
router.post("/auth/reset-password", authStudent.setNewPassword);
//resend reset otp
router.post("/auth/resend-reset-otp", authStudent.resendResetOtp);

module.exports = router;
