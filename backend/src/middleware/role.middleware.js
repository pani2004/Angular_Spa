import { errorResponse } from '../utils/response.util.js';

/**
 * Role-based access control middleware
 * @param {array} allowedRoles - Array of allowed roles
 * @returns {function} Express middleware function
 */
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Insufficient permissions', 403);
    }

    next();
  };
}

export default roleMiddleware;
