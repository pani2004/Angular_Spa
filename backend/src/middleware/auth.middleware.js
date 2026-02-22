import * as tokenService from '../services/token.service.js';
import { errorResponse } from '../utils/response.util.js';

/**
 * Authentication middleware
 * Verifies JWT token from cookie and attaches user to request
 */
async function authMiddleware(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return errorResponse(res, 'Access token not found', 401);
    }
    const decoded = tokenService.verifyToken(accessToken);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
}

export default authMiddleware;
