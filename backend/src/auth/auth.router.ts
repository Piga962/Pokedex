import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', authController.registerHandler);
router.post('/login', authController.loginHandler);

export default router;