import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { AppError } from '../utils/AppError';

// On Vercel / serverless environment, use /tmp/uploads directory; otherwise process.cwd()/uploads
const uploadDir = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(process.cwd(), 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('[Upload Directory Warning]', (err as Error).message);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPG, PNG, WEBP, and SVG images are allowed.', 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
