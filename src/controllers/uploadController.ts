import { Response } from 'express';
import cloudinary from 'cloudinary';
import fs from 'fs';
import prisma from '../prisma/client';
import { config } from '../config';
import { AuthRequest } from '../middleware/authMiddleware';
import { successResponse, errorResponse } from '../utils/apiResponse';

cloudinary.v2.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  const { type } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json(errorResponse('File is required'));
  }

  if (!req.user) {
    return res.status(401).json(errorResponse('Unauthorized'));
  }

  try {
    // For multer-storage-cloudinary, the file should have a url property
    let fileUrl = (file as any).secure_url || (file as any).url || file.path;

    if (!fileUrl) {
      return res.status(500).json(errorResponse('Failed to get uploaded file URL'));
    }

    const document = await prisma.document.create({
      data: {
        userId: req.user.id,
        type: type || 'CV',
        url: fileUrl,
      },
    });

    res.json(successResponse('Document uploaded', { document }));
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json(errorResponse('Upload failed', error));
  }
};

export const getUserDocuments = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(errorResponse('Unauthorized'));
  }

  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user.id },
      select: { id: true, type: true, url: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(successResponse('Documents loaded', { documents }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load documents', error));
  }
};
