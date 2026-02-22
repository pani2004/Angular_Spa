import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.config.js';
import * as tokenRepository from '../repositories/token.repository.js';

/**
 * Generate access token
 * @param {object} user - User object
 * @returns {string} JWT access token
 */
function generateAccessToken(user) {
  const payload = {
    userId: user.userId,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.accessTokenExpiration
  });
}

/**
 * Generate refresh token
 * @param {object} user - User object
 * @returns {string} JWT refresh token
 */
function generateRefreshToken(user) {
  const payload = {
    userId: user.userId,
    type: 'refresh'
  };

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.refreshTokenExpiration
  });
}

/**
 * Verify token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Store refresh token in database
 * @param {string} token - Refresh token
 * @param {string} userId - User ID
 * @returns {Promise<object>} Stored token data
 */
async function storeRefreshToken(token, userId) {
  // Calculate expiration timestamp (7 days from now)
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
  return tokenRepository.create(token, userId, expiresAt);
}

/**
 * Verify refresh token from database
 * @param {string} token - Refresh token
 * @returns {Promise<object>} Token data if valid
 * @throws {Error} If token is invalid or expired
 */
async function verifyRefreshToken(token) {
  const decoded = verifyToken(token);
  
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  const tokenData = await tokenRepository.findByToken(token);
  
  if (!tokenData) {
    throw new Error('Token not found');
  }

  if (tokenData.isRevoked) {
    throw new Error('Token has been revoked');
  }

  if (tokenData.expiresAt < Date.now()) {
    throw new Error('Token has expired');
  }

  return tokenData;
}

/**
 * Revoke refresh token
 * @param {string} token - Refresh token
 * @returns {Promise<boolean>} True if revoked
 */
async function revokeRefreshToken(token) {
  return tokenRepository.revoke(token);
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  storeRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken
};
