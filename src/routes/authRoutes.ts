import { Router } from 'express';
import { register, login, refreshToken, logout, forgotPassword, resetPassword, verifyResetPasswordToken, verifyEmail, testEmail } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import upload from '../middleware/upload';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordWithTokenSchema } from '../validators/authValidator';

const router = Router();

router.post('/register', upload.single('resume'), validateRequest(registerSchema), register);
router.get('/reset-password', validateRequest(resetPasswordWithTokenSchema), verifyResetPasswordToken);
router.post('/login', validateRequest(loginSchema), login);
router.post('/test-email', testEmail);
router.get('/verify/:token', verifyEmail);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordWithTokenSchema), resetPassword);

export default router;
