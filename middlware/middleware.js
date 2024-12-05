const rateLimit = require("express-rate-limit");

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
  const minDelay = 1000;
  const maxDelay = 3000;
  const delay =
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  setTimeout(() => next(), delay);
};

module.exports = { limiter, addDelay, hourLimiter };
