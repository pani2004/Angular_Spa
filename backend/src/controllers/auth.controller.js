import * as userRepository from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import * as tokenService from '../services/token.service.js';
import { successResponse, errorResponse } from '../utils/response.util.js';
import jwtConfig from '../config/jwt.config.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 409);
    }
    const passwordHash = await hashPassword(password);
    const user = await userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role: role || 'USER'
    });

    return successResponse(res, { user }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }
    
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    if (user.role !== role) {
      return errorResponse(res, 'Invalid role selected', 401);
    }

    // Update last login
    await userRepository.updateLastLogin(user.userId);
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);
    await tokenService.storeRefreshToken(refreshToken, user.userId);
    const { passwordHash, ...userWithoutPassword } = user;

    res.cookie('accessToken', accessToken, jwtConfig.accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, jwtConfig.refreshTokenCookieOptions);

    return successResponse(res, { user: userWithoutPassword }, 'Login successful');
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      await tokenService.revokeRefreshToken(refreshToken);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return successResponse(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token not found', 401);
    }
    const tokenData = await tokenService.verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(tokenData.userId);
    
    if (!user) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return errorResponse(res, 'User not found', 401);
    }

    if (!user.isActive) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return errorResponse(res, 'Account is deactivated', 403);
    }
    const accessToken = tokenService.generateAccessToken(user);
    const { passwordHash, ...userWithoutPassword } = user;
    res.cookie('accessToken', accessToken, jwtConfig.accessTokenCookieOptions);

    return successResponse(res, { user: userWithoutPassword }, 'Token refreshed successfully');
  } catch (error) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return errorResponse(res, error.message, 401);
  }
}

/**
 * Get current user
 * GET /api/auth/me
 */
export async function getCurrentUser(req, res, next) {
  try {
    const user = await userRepository.findById(req.user.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    const { passwordHash, ...userWithoutPassword } = user;
    return successResponse(res, { user: userWithoutPassword }, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
}
