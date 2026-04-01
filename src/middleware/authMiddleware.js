const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // Unauthorized (no token provided)
  }
    // 2. Verify the token
  jwt.verify(token, process.env.jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (token is no longer valid)
    }

    // 3. Attach user info to the request object
    req.user = user;
    next(); // Move on to the next function (the controller)
  });
};

module.exports = authMiddleware;