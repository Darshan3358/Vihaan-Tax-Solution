import React from 'react';
import { SEO } from '../components/common/SEO';

export const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEO title="Privacy Policy" />
      <section className="pt-32 pb-16 bg-navy-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">Privacy Policy</h1>
          <p className="text-slate-300 text-sm mt-2">Vihaan Tax Solutions Privacy & Data Protection Policy</p>
        </div>
      </section>

      <section className="py-16 bg-white text-slate-700 leading-relaxed text-sm">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-xl font-bold text-navy-900">1. Information We Collect</h2>
          <p>
            When you submit an enquiry form or request a tax consultation through Vihaan Tax Solutions, we collect personal information such as your name, mobile phone number, email address, and service preferences.
          </p>

          <h2 className="text-xl font-bold text-navy-900">2. Confidentiality & Data Protection</h2>
          <p>
            Confidentiality is our founding core value. Any financial records, GST returns, income tax computation details, or document proofs provided to Mr. Vilas Joshi and our team are strictly used for your requested compliance services and are never shared with third-party unauthorized entities.
          </p>

          <h2 className="text-xl font-bold text-navy-900">3. How We Use Your Data</h2>
          <p>
            Your contact details are strictly utilized to contact you regarding your consultation request, send return filing reminders, or provide updates regarding your tax application status.
          </p>

          <h2 className="text-xl font-bold text-navy-900">4. Contacting Us</h2>
          <p>
            If you have questions regarding our privacy practices, please contact us at Info.vihaantax@gmail.com or +91 78610 96198.
          </p>
        </div>
      </section>
    </>
  );
};
