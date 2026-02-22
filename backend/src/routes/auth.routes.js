import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validate from '../middleware/validation.middleware.js';
import { registerSchema, loginSchema } from '../utils/validators.util.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for login endpoint 
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  message: 'Too many login attempts, please try again later'
});

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;
