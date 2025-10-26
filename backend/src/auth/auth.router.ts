import { Router } from 'express';
import * as authController from './auth.controller';
import { authMiddleware } from '../middleware/auth';
const router = Router();

router.post('/register', authController.registerHandler);
router.post('/login', authController.loginHandler);
router.post('/logout', authController.logoutHandler);
router.get('/me', authMiddleware, authController.meHandler);

export default router;
