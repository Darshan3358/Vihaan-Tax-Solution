import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  designation: string;
  company: string;
  image: string;
  rating: number;
  content: string;
  published: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, default: 'Client' },
    company: { type: String, default: '' },
    image: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    content: { type: String, required: true },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
