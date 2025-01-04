const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const applyCors = require("./middleware");
const routes = require("./routes");

dotenv.config();
const app = express();

app.use(express.json());

connectDB();
applyCors(app);

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Server Express is working!");
});

module.exports = app;
