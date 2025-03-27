const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
console.log('verifyToken Middleware Hit');

const verifyToken = async (req, res, next) => {
  try {
    // Skip token verification for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return next();
    }

    let token = req.headers['authorization'];
    
    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'No token provided!'
      });
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userType = decoded.userType;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized! Invalid token.'
    });
  }
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
