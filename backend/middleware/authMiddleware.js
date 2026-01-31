const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const parts = authHeader.split(' ');
    const token = parts[1];

    if (!token) {
      return res.status(401).json({ message: 'Invalid token format. Use Bearer TOKEN' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }

    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
