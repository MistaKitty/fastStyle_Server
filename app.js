const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const applyMiddleware = require("./middleware");
const { limiter, addDelay, hourLimiter } = require("./middleware/middleware");
const routes = require("./routes");

dotenv.config();
const app = express();

app.use(express.json());

connectDB();
applyMiddleware(app);

app.use("/api", limiter, hourLimiter, addDelay, routes);

app.get("/", (req, res) => {
  res.send("Server Express is working!");
});

module.exports = app;
