import { Router } from 'express';
import { register, login, refreshToken, logout, forgotPassword, resetPassword, verifyEmail } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import upload from '../middleware/upload';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordWithTokenSchema } from '../validators/authValidator';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/verify/:token', verifyEmail);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordWithTokenSchema), resetPassword);

export default router;
