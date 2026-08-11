import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  fileName: string;
  url: string;
  publicId: string;
  altText: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  createdAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    altText: { type: String, default: '' },
    mimeType: { type: String, default: 'image/jpeg' },
    size: { type: Number, default: 0 },
    uploadedBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

export const Media = mongoose.model<IMedia>('Media', mediaSchema);
