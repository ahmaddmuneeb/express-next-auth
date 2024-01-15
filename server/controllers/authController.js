const User = require("../models/User");
const bcrypt = require("bcrypt");
// token generator
const { generateToken } = require("../middleware/auth");

// user registration controller
const register = async (req, res) => {
  const { email, name, password, username } = req.body;
  if (!username && !email && !password && !name) {
    return res
      .status(403)
      .json({ error: true, status: 403, message: "All Fields are required" });
  }
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: true, status: 409, message: "Username already exists" });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    const updatedUser = {
      id: newUser?._id,
      email: newUser?.email,
      name: newUser?.name,
      username: newUser?.username,
      createdAt: newUser?.createdAt,
      updatedAt: newUser?.updatedAt,
    };

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User has been registered successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, status: 500, message: err.message });
  }
};
// user login controller
const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body?.username });

    if (!user) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "User does not exist",
      });
    }

    req.session.user = user;
    req.session.save();

    const { token } = generateToken(req.session);
    const updatedUser = {
      id: req.session?.user?._id,
      email: req.session?.user?.email,
      name: req.session?.user?.name,
      username: req.session?.user?.username,
      createdAt: req.session?.user?.createdAt,
      updatedAt: req.session?.user?.updatedAt,
    };

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User logged in successfully",
      token: token,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      status: 500,
      message: error?.message,
    });
  }
};
// user logout controller
const logout = async (req, res) => {
  try {
    if (!req.session) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Session does not exist or has already been expired",
      });
    }

    req.session.destroy();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User has been logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      status: 500,
      message: error?.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};
