const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"SafeAuth" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your SafeAuth Verification Code",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <h2 style="color: #0d7377;">SafeAuth</h2>
        <p style="color: #333; font-size: 16px;">Your 6-digit verification code is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #0d7377; margin: 24px 0;">${otp}</div>
        <p style="color: #888; font-size: 13px;">This code expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
};

module.exports = { sendOTP };