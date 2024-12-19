const express = require("express");
const userRoutes = require("./userRoutes");
const { validateReCaptcha } = require("../controllers/reCaptchaController");

const router = express.Router();

router.post("/validate-recaptcha", validateReCaptcha);

router.use("/users", userRoutes);

module.exports = router;
