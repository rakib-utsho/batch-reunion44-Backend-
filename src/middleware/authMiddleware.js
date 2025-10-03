const studentModel = require("../models/Student.model");
const jwt = require("jsonwebtoken");

async function authStudentMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "User not authorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await studentModel.findById(decoded.id);
    if (!student) {
      return res.status(401).json({
        success: false,
        message: "You are not a valid food partner",
      });
    }

    req.student = student;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
}

module.exports = {
  authStudentMiddleware,
};
