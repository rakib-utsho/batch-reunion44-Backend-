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
  <div style="
    font-family: 'Arial', sans-serif; 
    line-height: 1.6; 
    color: #333; 
    max-width: 600px; 
    margin: 0 auto; 
    padding: 20px; 
    background-color: #f9f9f9; 
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  ">
    <h2 style="color: #2c3e50; text-align: center;">Welcome Back, ${name}! 🎓</h2>
    <p style="font-size: 16px;">Congratulations once again on your graduation — you're officially part of the proud <strong>Batch of 44</strong> alumni!</p>
    <p style="font-size: 16px;">Your account has been successfully verified, giving you full access to our exclusive alumni forum.</p>
    
    <p style="font-size: 16px;">Here, you can:</p>
    <ul style="font-size: 16px; padding-left: 20px; color: #555;">
      <li>Reconnect with old classmates and friends</li>
      <li>Share career updates, achievements, and opportunities</li>
      <li>Collaborate on projects or mentorships</li>
      <li>Stay informed about alumni meetups and university events</li>
    </ul>
    
    <p style="font-size: 16px;">This is more than just a forum — it's a community built on shared memories, mutual support, and lifelong bonds.</p>
    <p style="font-size: 16px;">We’re honored to have you here.</p>
    
    <p style="font-size: 16px; margin-top: 30px;">Warm regards,<br>
    <strong>The Batch of 44 Alumni Network</strong></p>
  </div>
`;

