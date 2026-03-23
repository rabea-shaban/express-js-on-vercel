const mongoose = require("mongoose");
const contactDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("error in db connection", error);
    process.exit(1);
  }
};

module.exports = contactDB;
