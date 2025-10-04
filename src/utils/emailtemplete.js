// utils/emailTemplates.js
exports.verificationEmail = (name, otp) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
    <h2>Welcome, ${name} 👋</h2>
    <p>Your OTP for verification is:</p>
    <h1 style="color:#4CAF50;letter-spacing:4px;">${otp}</h1>
    <p>This OTP will expire in <b>10 minutes</b>.</p>
  </div>
`;

exports.resetPasswordEmail = (name, otp) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
    <h2>Hi ${name},</h2>
    <p>We received a request to reset your password.</p>
    <p>Your OTP is:</p>
    <h1 style="color:#E91E63;letter-spacing:4px;">${otp}</h1>
    <p>This OTP expires in <b>10 minutes</b>.</p>
  </div>
`;
