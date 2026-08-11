import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  mapEmbedUrl: string;
  officeHours: string;
  consultant: {
    name: string;
    designation: string;
    bio: string;
    philosophy: string;
    experienceYears: string;
    image: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    heroImage: string;
  };
  trustStats: Array<{
    number: string;
    label: string;
    visible: boolean;
  }>;
  socialLinks: {
    whatsapp: string;
    linkedin: string;
    instagram: string;
    facebook: string;
  };
  reviewSource?: 'live' | 'mock';
  googlePlaceUrl?: string;
  googleRating?: number;
  googleReviewCount?: number;
  globalSeo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    companyName: { type: String, default: 'Vihaan Tax Solutions' },
    tagline: { type: String, default: 'Trusted, Confidential and Professional Tax & Advisory' },
    phone: { type: String, default: '+91 78610 96198' },
    email: { type: String, default: 'Info.vihaantax@gmail.com' },
    whatsapp: { type: String, default: '917861096198' },
    address: { type: String, default: 'Vihaan Tax Solutions Office, Consultancy Chambers, India' },
    mapEmbedUrl: { type: String, default: 'https://maps.google.com/maps?q=India&t=&z=13&ie=UTF8&iwloc=&output=embed' },
    officeHours: { type: String, default: 'Monday - Saturday: 9:30 AM - 7:00 PM' },
    consultant: {
      name: { type: String, default: 'Mr. Vilas Joshi' },
      designation: { type: String, default: 'Tax Consultant' },
      bio: { type: String, default: 'Expert tax advisor assisting individuals and enterprises with tax compliance, GST, accounting, and financial planning.' },
      philosophy: { type: String, default: 'Delivering clarity in numbers and confidentiality in every consultation.' },
      experienceYears: { type: String, default: '10+' },
      image: { type: String, default: '/images/vilas_joshi.png' },
    },
    hero: {
      eyebrow: { type: String, default: 'TAX • GST • ACCOUNTING • BUSINESS ADVISORY' },
      heading: { type: String, default: 'Clarity in Numbers. Confidence in Every Decision.' },
      description: { type: String, default: 'Professional tax, GST, accounting, and business advisory services designed to help individuals and businesses stay compliant, reduce unnecessary tax burdens, and make better financial decisions.' },
      ctaPrimary: { type: String, default: 'Book a Consultation' },
      ctaSecondary: { type: String, default: 'Explore Services' },
      heroImage: { type: String, default: '/images/hero.png' },
    },
    trustStats: [
      {
        number: { type: String, default: '10+' },
        label: { type: String, default: 'Years Experience' },
        visible: { type: Boolean, default: true },
      },
      {
        number: { type: String, default: '500+' },
        label: { type: String, default: 'Clients Assisted' },
        visible: { type: Boolean, default: true },
      },
      {
        number: { type: String, default: '6+' },
        label: { type: String, default: 'Core Services' },
        visible: { type: Boolean, default: true },
      },
      {
        number: { type: String, default: '100%' },
        label: { type: String, default: 'Client Confidentiality' },
        visible: { type: Boolean, default: true },
      },
    ],
    socialLinks: {
      whatsapp: { type: String, default: 'https://wa.me/917861096198' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
    reviewSource: { type: String, enum: ['live', 'mock'], default: 'live' },
    googlePlaceUrl: {
      type: String,
      default: 'https://www.google.com/search?q=vihaan-tax-solution+baroda',
    },
    googleRating: { type: Number, default: 5.0 },
    googleReviewCount: { type: Number, default: 117 },
    globalSeo: {
      metaTitle: { type: String, default: 'Vihaan Tax Solutions | Tax Consultancy' },
      metaDescription: { type: String, default: 'Expert GST Registration, GST Returns, Accounting, Audit, Firm Registration, and ITR Filing services by Mr. Vilas Joshi.' },
      keywords: [{ type: String }],
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const Setting = mongoose.model<ISetting>('Setting', settingSchema);
