const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { limiter, addDelay, hourLimiter } = require("./middleware/middleware");
const validateReCaptchaToken = require("./middleware/reCaptchaValidator");

dotenv.config();

const app = express();

connectDB();

const allowedOrigins = [process.env.API_LOCAL, process.env.API_REMOTE];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.post("/api/validate-recaptcha", async (req, res) => {
  const { token, action } = req.body;
  try {
    const result = await validateReCaptchaToken(token, action);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.use("/api/users", addDelay, limiter, hourLimiter, userRoutes);

app.get("/", (req, res) => {
  res.send("Server Express is working!");
});

module.exports = app;
