const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String },
    company: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
  },
  { _id: false } // prevent creating extra _id for each subdocument
);

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
    phone: {
      type: Number,
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
    jobInfo: {
      type: [JobSchema],
      validate: {
        validator: function (jobs) {
          // each job must have endDate if current is false
          return jobs.every((job) => job.current === true || !!job.endDate);
        },
        message: "Each job must have an endDate if current is false",
      },
    },

    // ✅ Social media links
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      portfolio: { type: String }, // optional — for personal site
    },

    // Verification and password reset
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },

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
