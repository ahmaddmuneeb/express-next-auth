const jwt = require("jsonwebtoken");

// auth for protected APIs
const requireAuth = (req, res, next) => {
  const authorizedToken = req.header("Authorization");

  if (!authorizedToken) {
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized", statusCode: 401 });
  }

  const token = authorizedToken.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: true,
        message: "Token is not valid",
        statusCode: 403,
      });
    }
    req.user = user;
    next();
  });
};
// admin user check
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access forbidden" });
  }

  next();
};
// generate JWT token
const generateToken = (user) => {
  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRY,
    }
  );

  return { token };
};
// logger
const routeLogger = (req, res, next) => {
  const route = req.path;
  const method = req.method;
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Endpoint: ${res?.statusCode} - ${method} - ${route}`);
    originalSend.call(this, body);
  };
  next();
};

module.exports = { requireAuth, requireAdmin, generateToken, routeLogger };
