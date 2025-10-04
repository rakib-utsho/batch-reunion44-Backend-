const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    // Registration Data
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    intake: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },

    //profile update data
    profileImage: {
      type: String,
    },
    location: {
      type: String,
    },
    higherEducation: [
      {
        degree: { type: String },
        institution: { type: String },
        yearCompleted: { type: String },
      },
    ],
    jobInfo: [
      {
        jobTitle: { type: String },
        company: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
      },
    ],

    // Verification and password reset
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },

    // Other details
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
