const axios = require("axios");
const rateLimit = require("express-rate-limit");

const validateReCaptchaToken = async (token, expectedAction, req) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  console.log("Validating reCAPTCHA token:", token);
  console.log("Expected action:", expectedAction);

  if (!token) {
    console.error("Token is missing.");
    throw new Error("Token is required.");
  }

  const remoteIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (!remoteIp) {
    console.error("Remote IP is missing.");
    throw new Error("Remote IP is required.");
  }

  const params = {
    secret: secretKey,
    response: token,
    remoteip: remoteIp,
  };
  console.log("Sending request to Google reCAPTCHA API with params:", params);

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      { params }
    );

    console.log("reCAPTCHA API response:", response.data);

    const { success, score, action, error_codes: errorCodes } = response.data;

    if (!success) {
      console.error(
        "reCAPTCHA validation failed due to success flag being false:",
        response.data
      );
      throw new Error("reCAPTCHA validation failed.");
    }

    if (action !== expectedAction) {
      console.error(
        "reCAPTCHA validation failed due to action mismatch. Expected:",
        expectedAction,
        "but got:",
        action
      );
      throw new Error("reCAPTCHA action mismatch.");
    }

    if (score < 0.5) {
      console.warn("reCAPTCHA validation failed due to low score:", score);
      throw new Error("reCAPTCHA score too low.");
    }

    console.log("reCAPTCHA validation succeeded:", { success, action, score });

    return { success: true, message: "reCAPTCHA validation successful." };
  } catch (error) {
    console.error("Error during reCAPTCHA validation:", error.message);
    throw new Error(`Error validating reCAPTCHA: ${error.message}`);
  }
};

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 12,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "error.tooManyRequests",
    });
  },
});

const hourLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "error.tooManyRequestsHour",
    });
  },
});

const addDelay = (req, res, next) => {
  const score = req.recaptchaScore;
  const minDelay = 500;
  const maxDelay = 600;
  const delay =
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  setTimeout(() => next(), delay);
};

module.exports = { limiter, addDelay, hourLimiter, validateReCaptchaToken };
