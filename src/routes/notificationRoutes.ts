import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController';

const router = Router();

router.get('/', getNotifications);
router.patch('/read/:id', markAsRead);

export default router;
