import { errorResponse } from '../utils/response.util.js';

/**
 * Centralized error handling middleware
 * Should be the last middleware in the chain
 */
function errorMiddleware(err, req, res, next) {
  console.error('Error:', err);
  if (err.name === 'ValidationError') {
    return errorResponse(res, err.message, 400);
  }

  if (err.name === 'UnauthorizedError') {
    return errorResponse(res, 'Unauthorized access', 401);
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // DynamoDB errors
  if (err.name === 'ResourceNotFoundException') {
    return errorResponse(res, 'Resource not found', 404);
  }

  if (err.name === 'ConditionalCheckFailedException') {
    return errorResponse(res, 'Item already exists or condition not met', 409);
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return errorResponse(res, message, statusCode);
}

/**
 * 404 handler for undefined routes
 */
function notFoundMiddleware(req, res) {
  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
}

export { errorMiddleware, notFoundMiddleware };
