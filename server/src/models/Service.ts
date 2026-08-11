import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceProcessStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface IServiceSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface IService extends Document {
  title: string;
  slug: string;
  category?: string;
  price?: string;
  shortDescription: string;
  description: string;
  icon: string;
  heroImage: string;
  thumbnail: string;
  benefits: string[];
  process: IServiceProcessStep[];
  documents: string[];
  ctaText: string;
  displayOrder: number;
  published: boolean;
  seo: IServiceSEO;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, default: 'General' },
    price: { type: String, default: '' },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'FileText' },
    heroImage: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    benefits: [{ type: String }],
    process: [
      {
        stepNumber: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    documents: [{ type: String }],
    ctaText: { type: String, default: 'Book Consultation' },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', serviceSchema);
