const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('./errors');
const logger = require('./logger');

// Secret key for JWT signing and verification
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate a JWT token for a user
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify a JWT token and return the decoded user data
const verifyToken = (token) => {
  try {
    if (!token) {
      throw new AuthenticationError('No token provided');
    }
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error('Token verification failed:', error);
    throw new AuthenticationError('Invalid token');
  }
};

// Express middleware to handle authentication
const authMiddleware = async ({ req }) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      // Verify token and attach user data to request
      const user = verifyToken(token);
      return { user };
    }
    return {};
  } catch (error) {
    logger.error('Authentication failed:', error);
    throw new AuthenticationError('Authentication failed');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware
}; 