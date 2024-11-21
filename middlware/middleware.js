const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 12,
  message: "Too many requests, please try again later.",
});

const addDelay = (req, res, next) => {
  const minDelay = 1000;
  const maxDelay = 2000;
  const delay =
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  setTimeout(() => next(), delay);
};

module.exports = { limiter, addDelay };
