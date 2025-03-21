const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token)
    return res
      .status(401)
      .json({ message: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.isAdmin) {
      req.user = decoded; // Attach user info to the request
      next(); // Proceed to the next middleware or route
    } else {
      res.status(403).json({ message: 'Access denied, admin only' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = adminMiddleware;
