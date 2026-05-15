import multer from "multer";
// @ts-ignore
import multerStorageCloudinary from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = multerStorageCloudinary({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw", // important for PDFs
    allowed_formats: ["pdf", "doc", "docx"],
  } as any
});

const upload = multer({ storage });

export default upload;