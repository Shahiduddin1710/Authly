const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { authenticator } = require("otplib");
const jsQR = require("jsqr");

router.post("/scan-qr", async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "Image required" });
  }

  try {
    const Jimp = require("jimp");
    const jsQR = require("jsqr");

    const buffer = Buffer.from(imageBase64, "base64");
    const image = await Jimp.read(buffer);

    image.resize(600, Jimp.AUTO);

    const { data, width, height } = image.bitmap;
    const uint8 = new Uint8ClampedArray(data);

    const code = jsQR(uint8, width, height, {
      inversionAttempts: "attemptBoth",
    });

    if (!code) {
      return res.status(400).json({ error: "No QR code found. Make sure QR is clear and fully visible." });
    }

    const qrData = code.data;
    console.log("QR found:", qrData);

    if (!qrData.startsWith("otpauth://")) {
      return res.status(400).json({ error: "Not a valid 2FA QR code" });
    }

    const url = new URL(qrData);
    const secretKey = url.searchParams.get("secret") || "";
    const issuer = url.searchParams.get("issuer") || "";
    const label = decodeURIComponent(url.pathname.replace("/totp/", ""));
    const accountEmail = label.includes(":") ? label.split(":")[1].trim() : label;
    const serviceName = issuer || (label.includes(":") ? label.split(":")[0].trim() : "Unknown");

    if (!secretKey) {
      return res.status(400).json({ error: "No secret key found in QR code" });
    }

    return res.status(200).json({ serviceName, accountEmail, secretKey });
  } catch (err) {
    console.log("QR scan error:", err);
    return res.status(400).json({ error: "Failed to process image." });
  }
});

router.post("/add", async (req, res) => {
  const { uid, serviceName, accountEmail, secretKey } = req.body;

  if (!uid || !serviceName || !secretKey) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const docRef = await db
    .collection("users")
    .doc(uid)
    .collection("accounts")
    .add({
      serviceName,
      accountEmail: accountEmail || "",
      secretKey,
      createdAt: new Date().toISOString(),
    });

  return res.status(201).json({ id: docRef.id, message: "Account added" });
});

router.post("/generate-totp", (req, res) => {
  console.log("generate-totp called with:", req.body);
  const { secretKey } = req.body;

  if (!secretKey) {
    return res.status(400).json({ error: "Secret key required" });
  }

  try {
    const cleanSecret = secretKey.replace(/\s/g, "").toUpperCase();
    const code = authenticator.generate(cleanSecret);
    const timeLeft = 30 - (Math.floor(Date.now() / 1000) % 30);
    return res.status(200).json({ code, timeLeft });
  } catch (err) {
    console.log("totp error:", err);
    return res.status(400).json({ error: "Invalid secret key" });
  }
});

router.get("/:uid", async (req, res) => {
  const { uid } = req.params;

  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("accounts")
    .orderBy("createdAt", "asc")
    .get();

  const accounts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return res.status(200).json({ accounts });
});

router.delete("/:uid/:accountId", async (req, res) => {
  const { uid, accountId } = req.params;

  await db
    .collection("users")
    .doc(uid)
    .collection("accounts")
    .doc(accountId)
    .delete();

  return res.status(200).json({ message: "Account deleted" });
});

router.put("/:uid/:accountId", async (req, res) => {
  const { uid, accountId } = req.params;
  const { serviceName, accountEmail } = req.body;

  if (!serviceName) {
    return res.status(400).json({ error: "Service name is required" });
  }

  await db
    .collection("users")
    .doc(uid)
    .collection("accounts")
    .doc(accountId)
    .update({ serviceName, accountEmail: accountEmail || "" });

  return res.status(200).json({ message: "Account updated" });
});

module.exports = router;