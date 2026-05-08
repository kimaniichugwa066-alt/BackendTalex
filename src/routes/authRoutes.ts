import { Router } from 'express';
import { register, login, refreshToken, logout, resetPassword } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { registerSchema, loginSchema, resetPasswordSchema } from '../validators/authValidator';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);

export default router;
