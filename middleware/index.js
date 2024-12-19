const cors = require("cors");
const { limiter, addDelay, hourLimiter } = require("./middleware");

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.API_LOCAL, process.env.API_REMOTE];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const applyMiddleware = (app) => {
  app.use(cors(corsOptions));
};

module.exports = applyMiddleware;
