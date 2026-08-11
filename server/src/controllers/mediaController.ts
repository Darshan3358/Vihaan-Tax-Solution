import { Response, NextFunction } from 'express';
import { Media } from '../models/Media';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middleware/authMiddleware';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary';
import fs from 'fs';

export const uploadMedia = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError('Please select an image file to upload', 400));
  }

  let fileUrl = `/uploads/${req.file.filename}`;
  let publicId = '';

  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'vihaan-tax-solutions',
      });
      fileUrl = result.secure_url;
      publicId = result.public_id;
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (err) {
      console.warn('Cloudinary upload warning, fallback to local URL:', err);
    }
  }

  const media = await Media.create({
    fileName: req.file.originalname,
    url: fileUrl,
    publicId,
    altText: req.body.altText || req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedBy: req.user?.name || 'Admin',
  });

  res.status(201).json({
    status: 'success',
    data: { media },
  });
});

export const getMediaList = catchAsync(async (_req: AuthRequest, res: Response) => {
  const mediaList = await Media.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: mediaList.length,
    data: { media: mediaList },
  });
});

export const deleteMedia = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const media = await Media.findById(req.params.id);
  if (!media) {
    return next(new AppError('Media item not found', 404));
  }

  if (media.publicId && isCloudinaryConfigured()) {
    try {
      await cloudinary.uploader.destroy(media.publicId);
    } catch (e) {
      console.warn('Could not delete from Cloudinary:', e);
    }
  }

  await media.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
