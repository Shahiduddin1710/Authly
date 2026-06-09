const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.get("/debug", (_, res) => {
  res.json({
    hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    privateKeyPreview: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50),
  });
});


app.get("/error", (_, res) => {
  res.json({ error: global._startupError || "No error captured" });
});


try {
const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/accounts");
const contactRoutes = require("./routes/contact");
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/contact", contactRoutes);
} catch (err) {
  global._startupError = { message: err.message, stack: err.stack };
  console.error("STARTUP CRASH:", err.message);
}

app.get("/health", (_, res) => {
  res.json({ status: "Authly backend running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;