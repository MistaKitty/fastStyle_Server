const express = require("express");
const {
  createUser,
  validateEmailRoute,
} = require("../controllers/userController");
const { validateReCaptchaToken } = require("../middleware/middleware");

const router = express.Router();

router.post("/register", createUser);

router.post("/validate-email", validateReCaptchaToken, validateEmailRoute);

module.exports = router;
