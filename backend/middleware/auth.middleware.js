const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
console.log('verifyToken Middleware Hit');

const verifyToken = (req, res, next) => {
  // Skip token verification for OPTIONS requests (pre-flight)
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Get token from various possible locations
  let token = req.headers['x-access-token'] || 
              req.headers['authorization'];
  
  // Handle 'Bearer' prefix if present
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }
  
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'No token provided!'
    });
  }

  // Log detailed debugging information for multipart requests
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    console.log('Processing multipart request with:');
    console.log('- Headers:', JSON.stringify(req.headers, null, 2));
    console.log('- Files present:', !!req.files);
    if (req.files) {
      console.log('- File keys:', Object.keys(req.files));
    }
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized! Token is invalid.',
        error: err.message
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user && user.userType === 'admin') {
      next();
      return;
    }

    res.status(403).json({
      message: "Require Admin Role!"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
