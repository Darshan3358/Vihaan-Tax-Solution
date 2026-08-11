import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: 'GST' | 'ITR' | 'Accounting' | 'Business Registration' | 'Audit' | 'General';
  displayOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: ['GST', 'ITR', 'Accounting', 'Business Registration', 'Audit', 'General'],
      default: 'General',
    },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FAQ = mongoose.model<IFAQ>('FAQ', faqSchema);
