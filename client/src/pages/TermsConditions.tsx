import React from 'react';
import { SEO } from '../components/common/SEO';

export const TermsConditions: React.FC = () => {
  return (
    <>
      <SEO title="Terms & Conditions" />
      <section className="pt-32 pb-16 bg-navy-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">Terms & Conditions</h1>
          <p className="text-slate-300 text-sm mt-2">Website & Consultancy Usage Terms</p>
        </div>
      </section>

      <section className="py-16 bg-white text-slate-700 leading-relaxed text-sm">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-xl font-bold text-navy-900">1. Engagement & Consultancy Terms</h2>
          <p>
            By accessing the Vihaan Tax Solutions website or requesting services (GST Registration, Return Filing, Bookkeeping, Audit, Firm Registration, or ITR filing), you agree to provide authentic and accurate documents required under applicable Indian statutory laws.
          </p>

          <h2 className="text-xl font-bold text-navy-900">2. Service Delivery</h2>
          <p>
            Timelines for GST certificates, return submissions, or company registrations are subject to official government portal processing times (GST Portal, Income Tax e-filing portal, MCA).
          </p>
        </div>
      </section>
    </>
  );
};
