const express = require("express");
const userRoutes = require("./userRoutes");
const { validateReCaptcha } = require("../controllers/reCaptchaController");
const { addDelay } = require("../middleware/middleware");

const router = express.Router();

router.post("/validate-recaptcha", validateReCaptcha);

router.use("/users", validateReCaptcha, addDelay, userRoutes);

module.exports = router;
