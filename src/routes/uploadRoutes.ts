import { Router } from 'express';
import upload from '../middleware/upload';

const router = Router();

router.post("/upload-resume", upload.single("resume"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({
      success: true,
      fileUrl: req.file.path
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
