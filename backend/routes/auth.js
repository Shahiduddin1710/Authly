const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { sendOTP } = require("../utils/mailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const otpStore = new Map();

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existing = await db
    .collection("users")
    .where("email", "==", email)
    .get();

  if (!existing.empty) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  otpStore.set(email, {
    otp,
    expiresAt,
    userData: { fullName, email, password: hashedPassword },
  });

  await sendOTP(email, otp);

  return res.status(200).json({ message: "OTP sent to email" });
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({ error: "No OTP found for this email" });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  const { fullName, email: userEmail, password } = record.userData;
  const uid = uuidv4();

  await db.collection("users").doc(uid).set({
    uid,
    fullName,
    email: userEmail,
    password,
    createdAt: new Date().toISOString(),
    verified: true,
  });

  otpStore.delete(email);

  return res.status(201).json({
    message: "Account created successfully",
    uid,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();

  if (snapshot.empty) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user = snapshot.docs[0].data();

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  return res.status(200).json({
    message: "Login successful",
    uid: user.uid,
    fullName: user.fullName,
    email: user.email,
  });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const snapshot = await db.collection("users").where("email", "==", email).get();

  if (snapshot.empty) {
    return res.status(404).json({ error: "No account found with this email" });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  otpStore.set(`reset_${email}`, { otp, expiresAt });

  await sendOTP(email, otp);

  return res.status(200).json({ message: "Password reset OTP sent to email" });
});

router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const record = otpStore.get(`reset_${email}`);

  if (!record) {
    return res.status(400).json({ error: "No OTP found. Request a new one." });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(`reset_${email}`);
    return res.status(400).json({ error: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  const snapshot = await db.collection("users").where("email", "==", email).get();

  if (snapshot.empty) {
    return res.status(404).json({ error: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const docId = snapshot.docs[0].id;

  await db.collection("users").doc(docId).update({ password: hashedPassword });

  otpStore.delete(`reset_${email}`);

  return res.status(200).json({ message: "Password reset successful" });
});

router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  const existing = otpStore.get(email);

  if (!existing || !existing.userData) {
    return res
      .status(400)
      .json({ error: "Session expired. Please sign up again." });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  otpStore.set(email, { otp, expiresAt, userData: existing.userData });

  await sendOTP(email, otp);

  return res.status(200).json({ message: "OTP resent" });
});

module.exports = router;