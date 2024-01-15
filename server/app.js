// libs import
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const cors = require("cors");
// modules import
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
// passport.js sessoion
const localStrategy = require("./middleware/passport");
const { routeLogger } = require("./middleware/auth");
// .env inilialization
dotenv.config();
// main server
const app = express();
// database initializaition
connectDB();
// app security layer
app.use(
  session({
    secret: "ahmadd2024",
    resave: false,
    saveUninitialized: false,
  }),
  routeLogger
);
// app.use functions
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Author≈ization"],
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
// Serialize and deserialize user objects to maintain user sessions
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
// Use the routes
app.use("/api/v1/auth", authRoutes);
// start the server
let PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
