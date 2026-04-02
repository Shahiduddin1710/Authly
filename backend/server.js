const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/accounts");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "SafeAuth backend running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});