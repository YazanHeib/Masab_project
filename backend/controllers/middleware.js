const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

module.exports = { verifyJWT };