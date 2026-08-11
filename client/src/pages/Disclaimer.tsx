import React from 'react';
import { SEO } from '../components/common/SEO';

export const Disclaimer: React.FC = () => {
  return (
    <>
      <SEO title="Disclaimer" />
      <section className="pt-32 pb-16 bg-navy-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">Professional Disclaimer</h1>
        </div>
      </section>

      <section className="py-16 bg-white text-slate-700 leading-relaxed text-sm">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-xl font-bold text-navy-900">General Information Disclaimer</h2>
          <p>
            The content provided on this website is for general informational and educational guidance regarding tax laws, GST filing, and accounting compliance. While we make every effort to maintain up-to-date statutory references, tax regulations change frequently.
          </p>

          <h2 className="text-xl font-bold text-navy-900">Individualized Professional Consultation</h2>
          <p>
            Information on this website does not constitute formal legal or audit opinion without a direct written engagement with Mr. Vilas Joshi at Vihaan Tax Solutions.
          </p>
        </div>
      </section>
    </>
  );
};
