const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  const dbURI =
    process.env.REMOTE === "true" ? process.env.DBREMOTE : process.env.DBLOCAL;

  try {
    await mongoose.connect(dbURI, {});
    console.log(
      `MongoDB ${
        process.env.REMOTE === "true" ? "remote" : "local"
      } connection established!`
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
