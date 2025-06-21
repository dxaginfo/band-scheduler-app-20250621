const jwt = require('jsonwebtoken');
const { getUserWithBands } = require('../../services/user.service');

/**
 * Socket.io middleware for authenticating users
 */
module.exports = async (socket, next) => {
  try {
    // Get token from handshake auth or query
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.id) {
      return next(new Error('Authentication error: Invalid token'));
    }

    // Get user with bands for room subscriptions
    const user = await getUserWithBands(decoded.id);
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: ' + error.message));
  }
};
