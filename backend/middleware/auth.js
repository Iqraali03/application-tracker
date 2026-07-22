const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Expect header format: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // splits "Bearer xyz" -> ["Bearer", "xyz"]

  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches { userId, email } to the request
    next(); // proceed to the actual route
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;