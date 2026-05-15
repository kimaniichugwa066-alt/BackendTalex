declare module 'pdfkit';
declare module 'socket.io';
declare module 'sib-api-v3-sdk';
declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer';
  import { UploadApiOptions } from 'cloudinary';

  interface CloudinaryStorageOptions {
    cloudinary: any;
    params?: UploadApiOptions & {
      folder?: string;
      resource_type?: string;
      allowed_formats?: string[];
    };
  }

  function multerStorageCloudinary(options: CloudinaryStorageOptions): StorageEngine;
  export = multerStorageCloudinary;
}
