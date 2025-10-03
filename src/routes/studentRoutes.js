const express = require("express");
const authStudent = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

//public routes
router.post("/register", authStudent.registerUser);
router.post("/login", authStudent.loginStudent);

//get profile
router.get("/getMe", authMiddleware.protect, authStudent.getMe);

module.exports = router;
