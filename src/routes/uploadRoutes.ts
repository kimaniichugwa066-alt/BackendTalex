import { Router } from 'express';
import upload from '../middleware/upload';
import { uploadDocument, getUserDocuments } from '../controllers/uploadController';

const router = Router();

router.post('/', upload.single('resume'), uploadDocument);
router.post('/upload-resume', upload.single('resume'), uploadDocument);
router.get('/documents', getUserDocuments);

export default router;
