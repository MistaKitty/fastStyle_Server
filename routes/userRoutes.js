const express = require("express");
const {
  createUser,
  validateEmailRoute,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", createUser);

router.post("/validate-email", validateEmailRoute);

module.exports = router;
