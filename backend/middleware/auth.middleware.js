const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const verifyToken = (req, res, next) => {
  console.log("Headers:", req.headers);
  
  // Try x-access-token header first
  let token = req.headers['x-access-token'];
  
  // If not found, try Authorization header
  if (!token && req.headers['authorization']) {
    // Extract the token from Bearer format
    const authHeader = req.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7, authHeader.length);
    }
  }

  if (!token) {
    console.log("No token provided in request headers");
    return res.status(403).send({
      success: false,
      message: 'No token provided!'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).send({
      success: false,
      message: 'Unauthorized!'
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
