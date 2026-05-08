import { Request, Response } from 'express';
import cloudinary from 'cloudinary';
import fs from 'fs';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { config } from '../config';

cloudinary.v2.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const uploadDocument = async (req: Request, res: Response) => {
  const { type } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json(errorResponse('File is required'));
  }

  try {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      resource_type: 'auto',
      folder: 'backendtalex',
    });

    fs.unlinkSync(file.path);

    res.json(successResponse('Document uploaded', { url: result.secure_url, type }));
  } catch (error) {
    res.status(500).json(errorResponse('Upload failed', error));
  }
};
