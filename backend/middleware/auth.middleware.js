const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({
      message: "No token provided!"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized!"
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
