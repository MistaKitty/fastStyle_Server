const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 12,
  message: "Too many requests, please try again later.",
});

const addDelay = (req, res, next) => {
  const minDelay = 100;
  const maxDelay = 200;
  const delay =
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  setTimeout(() => next(), delay);
};

module.exports = { limiter, addDelay };
