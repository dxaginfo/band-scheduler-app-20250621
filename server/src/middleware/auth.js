const jwt = require('jsonwebtoken');
const { getUserById } = require('../services/user.service');

/**
 * Middleware to authenticate and authorize users
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Get user from database
    const user = await getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    next(error);
  }
};

/**
 * Middleware to authorize band admin or leader
 */
exports.authorizeBandRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const bandId = req.params.bandId || req.body.bandId;
      
      if (!bandId) {
        return res.status(400).json({ message: 'Band ID is required' });
      }
      
      // Check if user is a member of the band with allowed role
      const isMember = await userService.checkUserBandRole(req.user.id, bandId, allowedRoles);
      
      if (!isMember) {
        return res.status(403).json({ message: 'You do not have permission to perform this action' });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
