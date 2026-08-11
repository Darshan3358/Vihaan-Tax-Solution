import React, { createContext, useContext, useState, useEffect } from 'react';
import { ISetting } from '../types';
import { settingApi } from '../services/api';

interface CMSContextType {
  settings: ISetting | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: ISetting = {
  companyName: 'Vihaan Tax Solutions',
  tagline: 'Trusted, Confidential and Professional Tax & Accounting Advisory',
  phone: '+91 78610 96198',
  email: 'Info.vihaantax@gmail.com',
  whatsapp: '917861096198',
  address: 'Vihaan Tax Solutions Office, Consultancy Chambers, India',
  mapEmbedUrl: 'https://maps.google.com/maps?q=India&t=&z=13&ie=UTF8&iwloc=&output=embed',
  officeHours: 'Monday - Saturday: 9:30 AM - 7:00 PM',
  consultant: {
    name: 'Mr. Vilas Joshi',
    designation: 'Tax Consultant',
    bio: 'With 7+ years of hands-on consultancy experience, Mr. Vilas Joshi has empowered hundreds of business owners, startups, and individual taxpayers with strategic tax planning, statutory GST compliance, meticulous accounting, and proactive financial oversight.',
    philosophy: 'Trusted. Confidential. Professional. Every financial decision deserves clarity, strategic depth, and total regulatory adherence.',
    experienceYears: '7+',
    image: '/images/vilas_joshi.png',
  },
  hero: {
    eyebrow: 'TAX • GST • ACCOUNTING • BUSINESS ADVISORY',
    heading: 'Clarity in Numbers. Confidence in Every Decision.',
    description: 'Professional tax, GST, accounting, and business advisory services designed to help individuals and businesses stay compliant, reduce unnecessary tax burdens, and make better financial decisions.',
    ctaPrimary: 'Book a Consultation',
    ctaSecondary: 'Explore Services',
    heroImage: '/images/hero.png',
  },
  trustStats: [
    { number: '7+', label: 'Years Experience', visible: true },
    { number: '500+', label: 'Clients Assisted', visible: true },
    { number: '6+', label: 'Core Services', visible: true },
    { number: '100%', label: 'Confidentiality Focused', visible: true },
  ],
  socialLinks: {
    whatsapp: 'https://wa.me/917861096198',
    linkedin: '',
    instagram: '',
    facebook: '',
  },
  reviewSource: 'live',
  googlePlaceUrl: 'https://www.google.com/search?q=vihaan-tax-solution+baroda',
  googleRating: 5.0,
  googleReviewCount: 117,
  globalSeo: {
    metaTitle: 'Vihaan Tax Solutions | Tax Consultancy',
    metaDescription: 'Expert GST Registration, GST Returns, Accounting, Audit, Firm Registration, and ITR Filing services by Mr. Vilas Joshi.',
    keywords: ['Tax Consultant', 'GST Registration', 'ITR Filing', 'Accounting Services'],
    ogImage: '/images/hero.png',
  },
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ISetting | null>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSettings = async () => {
    try {
      const fetchedSettings = await settingApi.getPublicSettings();
      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }
    } catch (error) {
      console.warn('Could not fetch settings from API, using defaults:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <CMSContext.Provider value={{ settings: settings || defaultSettings, isLoading, refreshSettings }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
