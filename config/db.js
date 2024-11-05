const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexão com MongoDB estabelecida");
  } catch (error) {
    console.error("Erro na conexão ao MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
