import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "talex-resumes",
    resource_type: "raw" // REQUIRED for PDF/DOC
  } as any
});

const upload = multer({ storage });

export default upload;