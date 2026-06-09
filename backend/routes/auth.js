const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const crypto = require("crypto");
const { sendOTP } = require("../utils/mailer");
const bcrypt = require("bcryptjs");

const otpStore = new Map();

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

router.post("/signup", async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
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
    const uid = crypto.randomUUID();

    await db.collection("users").doc(uid).set({
      uid,
      fullName,
      email: userEmail,
      password,
      createdAt: new Date().toISOString(),
      verified: true,
    });

    otpStore.delete(email);

    return res.status(201).json({ message: "Account created successfully", uid });
  } catch (err) {
    return res.status(500).json({ error: "OTP verification failed", details: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).json({ error: "Login failed", details: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No account found with this email" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(`reset_${email}`, { otp, expiresAt });

    await sendOTP(email, otp);

    return res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (err) {
    return res.status(500).json({ error: "Forgot password failed", details: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
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

    if (String(record.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const docId = snapshot.docs[0].id;

    await db.collection("users").doc(docId).update({ password: hashedPassword });

    otpStore.delete(`reset_${email}`);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ error: "Reset password failed", details: err.message });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const existing = otpStore.get(email);

    if (!existing || !existing.userData) {
      return res.status(400).json({ error: "Session expired. Please sign up again." });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(email, { otp, expiresAt, userData: existing.userData });

    await sendOTP(email, otp);

    return res.status(200).json({ message: "OTP resent" });
  } catch (err) {
    return res.status(500).json({ error: "Resend OTP failed", details: err.message });
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const { uid, currentPassword, newPassword } = req.body;

    if (!uid || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const doc = await db.collection("users").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = doc.data();
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection("users").doc(uid).update({ password: hashedPassword });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Change password failed", details: err.message });
  }
});

router.post("/logout-all-devices", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "UID required" });

    await db.collection("users").doc(uid).update({
      loggedOutAt: new Date().toISOString(),
    });

    return res.status(200).json({ message: "Logged out from all devices" });
  } catch (err) {
    return res.status(500).json({ error: "Logout failed", details: err.message });
  }
});

router.delete("/delete-account", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "UID required" });

    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const accountsSnap = await db.collection("accounts").where("uid", "==", uid).get();
    const batch = db.batch();
    accountsSnap.forEach((doc) => batch.delete(doc.ref));
    batch.delete(db.collection("users").doc(uid));
    await batch.commit();

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const record = otpStore.get(`reset_${email}`);

    console.log("OTP Store key:", `reset_${email}`);
    console.log("Record found:", record);
    console.log("Received OTP:", otp, typeof otp);
    console.log("Stored OTP:", record?.otp, typeof record?.otp);

    if (!record) {
      return res.status(400).json({ error: "No OTP found. Request a new one." });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(`reset_${email}`);
      return res.status(400).json({ error: "OTP expired" });
    }

    if (String(record.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    return res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    return res.status(500).json({ error: "Verification failed", details: err.message });
  }
});

module.exports = router;