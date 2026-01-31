const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const userRole = req.user.role;

      if (!userRole || userRole !== requiredRole) {
        return res.status(403).json({ message: `Access denied. Only ${requiredRole} can access this.` });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Error checking role' });
    }
  };
};

module.exports = roleMiddleware;
