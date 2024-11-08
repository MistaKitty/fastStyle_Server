const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  const dbURI =
    process.env.REMOTE === "true" ? process.env.DBREMOTE : process.env.DBLOCAL;

  try {
    await mongoose.connect(dbURI, {});
    console.log(
      `Conexão com MongoDB ${
        process.env.REMOTE === "true" ? "remoto" : "local"
      } estabelecida!`
    );
  } catch (error) {
    console.error("Erro na conexão ao MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
