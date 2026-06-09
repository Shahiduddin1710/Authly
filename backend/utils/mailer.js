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
    from: `"Authly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Authly Verification Code",
    html: `
      <div style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 480px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
          
          <div style="background-color: #0f172a; padding: 28px 32px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 1px;">Authly</h1>
            <p style="margin: 6px 0 0; color: #94a3b8; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase;">Secure 2FA Authenticator</p>
          </div>

          <div style="padding: 40px 32px;">
            <h2 style="margin: 0 0 8px; color: #0f172a; font-size: 18px; font-weight: 600;">Verification Code</h2>
            <p style="margin: 0 0 28px; color: #64748b; font-size: 14px; line-height: 1.6;">
              Use the code below to complete your verification. This code is valid for 10 minutes.
            </p>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px 16px; text-align: center; margin-bottom: 28px;">
              <p style="margin: 0 0 8px; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">One-Time Password</p>
              <div style="font-size: 40px; font-weight: 700; letter-spacing: 16px; color: #0f172a; font-family: 'Courier New', monospace;">${otp}</div>
            </div>

            <div style="background-color: #fef2f2; border-left: 3px solid #ef4444; border-radius: 6px; padding: 14px 16px; margin-bottom: 28px;">
              <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.5;">
                Never share this code with anyone. Authly will never ask for your OTP via call or chat.
              </p>
            </div>

            <p style="margin: 0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
              If you did not request this code, you can safely ignore this email. Your account remains secure.
            </p>
          </div>

          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
            <p style="margin: 0 0 4px; color: #94a3b8; font-size: 12px;">This is an automated message from Authly.</p>
            <p style="margin: 0; color: #cbd5e1; font-size: 11px;">Authly Platform v1.0 — Built by Shaho</p>
          </div>

        </div>
      </div>
    `,
  });
};

module.exports = { sendOTP };