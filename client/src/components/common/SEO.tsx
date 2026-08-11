import React, { useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  const { settings } = useCMS();

  const siteTitle = title
    ? `${title} | ${settings?.companyName || 'Vihaan Tax Solutions'}`
    : settings?.globalSeo?.metaTitle || 'Vihaan Tax Solutions | CA & Tax Consultancy';

  const metaDesc =
    description ||
    settings?.globalSeo?.metaDescription ||
    'Professional tax, GST, accounting, audit, firm registration, and ITR filing services by Mr. Vilas Joshi.';

  useEffect(() => {
    document.title = siteTitle;

    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', metaDesc);
  }, [siteTitle, metaDesc]);

  return null;
};
