const User = require("../models/User");
const emailValidator = require("email-validator");

const validateEmail = async (email) => {
  if (!email || !emailValidator.validate(email)) {
    return { isValid: false, message: "error.emailInvalid" };
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return { isValid: false, message: "error.emailExists" };
  }

  return { isValid: true, message: "" };
};

const createUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "error.emailRequired" });
  }

  const { isValid, message } = await validateEmail(email);

  if (!isValid) {
    return res.status(400).json({ message });
  }

  try {
    const newUser = new User({ email });
    await newUser.save();

    res.status(201).json({ message: "success.userCreated" });
  } catch (error) {
    res.status(500).json({ message: "error.userCreationFailed" });
  }
};

const validateEmailRoute = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "error.emailRequired" });
    }

    const { isValid, message } = await validateEmail(email);

    if (!isValid) {
      return res.status(400).json({ message });
    }

    res.status(200).json({ message: "success.emailValid" });
  } catch (error) {
    console.error("Erro na rota /validate-email:", error.message);
    return res.status(500).json({ message: "error.serverError" });
  }
};

module.exports = { createUser, validateEmail, validateEmailRoute };
