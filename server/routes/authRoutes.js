const express = require("express");
const router = express.Router();
const passport = require("passport");
// import auth controller
const authController = require("../controllers/authController");
// routes for authentication
router.post("/register", authController.register);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  authController.login
);
router.get("/logout", authController.logout);

module.exports = router;
