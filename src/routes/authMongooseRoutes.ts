import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/authMongooseController';
import { authMiddleware } from '../middleware/authMiddleware';
import upload from '../middleware/upload';

const router = Router();

// Register with resume upload
router.post('/register', upload.single('resume'), register);

// Login
router.post('/login', login);

// Get current user (protected)
router.get('/me', authMiddleware, getCurrentUser);

export default router;
