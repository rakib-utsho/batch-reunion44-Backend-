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

// utils/emailTemplates.js

exports.welcomeEmail = (name) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
    <h2>Welcome Back, ${name}! 🎓</h2>
    <p>Congratulations once again on your graduation — you're officially part of the proud <strong>Batch of 44</strong> alumni!</p>
    <p>Your account has been successfully verified, and you now have full access to our exclusive alumni forum.</p>
    <p>Here, you can:</p>
    <ul>
      <li>Reconnect with old classmates and friends</li>
      <li>Share career updates, achievements, and opportunities</li>
      <li>Collaborate on projects or mentorships</li>
      <li>Stay informed about alumni meetups and university events</li>
    </ul>
    <p>This is more than just a forum — it's a community built on shared memories, mutual support, and lifelong bonds.</p>
    <p>We’re honored to have you here.</p>
    <p>Warm regards,<br>
    The Batch of 44 Alumni Network</p>
  </div>
`;
