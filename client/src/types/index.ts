export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
}

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

export interface IService {
  _id: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ILeadNote {
  _id?: string;
  author: string;
  note: string;
  createdAt: string;
}

export interface ILead {
  _id: string;
  leadNumber: string;
  name: string;
  phone: string;
  email: string;
  serviceId?: string;
  serviceName: string;
  customerType: 'Individual' | 'Business';
  message: string;
  preferredContactMethod: 'Call' | 'WhatsApp' | 'Email';
  preferredContactTime?: string;
  whatsappConsent: boolean;
  status: 'New' | 'Contacted' | 'In Discussion' | 'Follow-Up' | 'Converted' | 'Closed' | 'Rejected';
  notes: ILeadNote[];
  source: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ITestimonial {
  _id: string;
  name: string;
  designation: string;
  company: string;
  image: string;
  rating: number;
  content: string;
  published: boolean;
  displayOrder: number;
  isGoogleReview?: boolean;
  googleReviewUrl?: string;
  timeAgo?: string;
}

export interface IFAQ {
  _id: string;
  question: string;
  answer: string;
  category: 'GST' | 'ITR' | 'Accounting' | 'Business Registration' | 'Audit' | 'General';
  displayOrder: number;
  published: boolean;
}

export interface IMedia {
  _id: string;
  fileName: string;
  url: string;
  publicId: string;
  altText: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

export interface ISetting {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  mapEmbedUrl: string;
  officeHours: string;
  reviewSource?: 'live' | 'mock';
  googlePlaceUrl?: string;
  googleRating?: number;
  googleReviewCount?: number;
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
  globalSeo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
}

export interface IDashboardStats {
  stats: {
    totalLeads: number;
    newLeads: number;
    inDiscussionLeads: number;
    convertedLeads: number;
    totalServices: number;
    publishedTestimonials: number;
  };
  leadsByService: Array<{ name: string; count: number }>;
  leadsByStatus: Array<{ status: string; count: number }>;
  recentLeads: ILead[];
}
