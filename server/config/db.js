const mongoose = require("mongoose");

// mongoDB connection
const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => console.log("Database has been connected successfully"))
    .catch((err) => console.error("Error connecting to Database:", err));
};

module.exports = connectDB;
