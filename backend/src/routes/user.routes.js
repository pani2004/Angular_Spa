import express from 'express';
import * as userController from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import delayMiddleware from '../middleware/delay.middleware.js';
import validate from '../middleware/validation.middleware.js';
import { updateUserSchema } from '../utils/validators.util.js';

const router = express.Router();


router.get('/profile', authMiddleware, userController.getProfile);
router.get('/records', authMiddleware, delayMiddleware, userController.getUserRecords);

router.get('/admin/users', authMiddleware, roleMiddleware(['ADMIN']), userController.getAllUsers);
router.put('/admin/users/:userId', authMiddleware, roleMiddleware(['ADMIN']), validate(updateUserSchema), userController.updateUser);
router.delete('/admin/users/:userId', authMiddleware, roleMiddleware(['ADMIN']), userController.deleteUser);

export default router;
