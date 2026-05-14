import { Router } from 'express';
import cors from 'cors';
import upload from '../middleware/upload';
import { uploadDocument, getUserDocuments } from '../controllers/uploadController';

const router = Router();

// Add CORS handling specifically for upload routes
const uploadCorsOptions = {
  origin: ['https://talex-one.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
};

router.use(cors(uploadCorsOptions));
router.options('*', cors(uploadCorsOptions));

router.post('/', upload.single('resume'), uploadDocument);
router.post('/upload-resume', upload.single('resume'), uploadDocument);
router.get('/documents', getUserDocuments);

export default router;
