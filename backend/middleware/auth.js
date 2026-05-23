const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Authentication is not configured' });
    }

    const token = req.header('Authorization')?.replace(/^Bearer\s+/i, '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.admin) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    req.admin = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

module.exports = auth;
