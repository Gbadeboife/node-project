// Middleware to authenticate requests and check user roles for portal routes
const JwtService = require('./JwtService');

module.exports = function (req, res, next) {
  // Extract token from the request
  const token = JwtService.getToken(req);
  if (!token) {
    // If no token is provided, deny access
    return res.status(401).json({
      success: false,
      message: 'No token provided. Access denied.'
    });
  }
  // Verify the token and extract payload
  const payload = JwtService.verifyAccessToken(token);
  if (!payload || !payload.user) {
    // If token is invalid or expired, deny access
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
  // Attach user_id and token payload to the request object for downstream use
  req.user_id = payload.user;
  req.tokenPayload = payload;

  // Check for portal-based role validation on /api/v1/<portal>/ routes
  const apiV1Match = req.path.match(/^\/api\/v1\/([^\/]+)\//);
  if (apiV1Match) {
    const portal = apiV1Match[1];
    // Ensure the user's role matches the portal name
    if (!payload.role || payload.role !== portal) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Role does not match portal.'
      });
    }
  }
  // Proceed to the next middleware or route handler
  next();
}; 