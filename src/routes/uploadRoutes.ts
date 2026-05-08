import { Router } from 'express';
import multer from 'multer';
import { uploadDocument } from '../controllers/uploadController';

const router = Router();
const upload = multer({ dest: '/tmp/uploads' });

router.post('/', upload.single('file'), uploadDocument);

export default router;
