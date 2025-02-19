const axios = require("axios");
const rateLimit = require("express-rate-limit");

const validateReCaptchaToken = async (token, expectedAction, req) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) throw new Error("Token is required.");

  const remoteIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!remoteIp) throw new Error("Remote IP is required.");

  const params = {
    secret: secretKey,
    response: token,
    remoteip: remoteIp,
  };

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      { params }
    );

    const { success, score, action } = response.data;

    if (!success) throw new Error("reCAPTCHA validation failed.");

    if (expectedAction && action !== expectedAction) {
      throw new Error(
        `reCAPTCHA action mismatch: received '${action}', expected '${expectedAction}'.`
      );
    }

    if (score < 0.5) throw new Error("reCAPTCHA score too low.");

    req.recaptchaScore = score;
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

  console.log("reCAPTCHA Score:", score);

  const minDelay = 500;
  const maxDelay = 600;
  const delay =
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  setTimeout(() => next(), delay);
};

module.exports = { limiter, addDelay, hourLimiter, validateReCaptchaToken };
