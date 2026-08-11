import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Users, BookOpenCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { SEO } from '../components/common/SEO';
import { SectionHeading } from '../components/common/SectionHeading';

export const About: React.FC = () => {
  const { settings } = useCMS();

  return (
    <>
      <SEO title="About Us" description="Learn about Vihaan Tax Solutions and Mr. Vilas Joshi's professional tax consultancy practice." />

      {/* Hero Header */}
      <section className="pt-32 pb-16 bg-navy-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-gold bg-brand-gold/10 px-3.5 py-1 rounded-full inline-block mb-4">
            About Our Practice
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Vihaan Tax Solutions</h1>
          <p className="mt-4 text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
            Providing clarity in tax, accounting, GST, and business advisory services with unwavering integrity.
          </p>
        </div>
      </section>

      {/* Main Profile & Practice Philosophy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                <img
                  src={settings?.consultant?.image || '/images/vilas_joshi.png'}
                  alt={settings?.consultant?.name || 'Mr. Vilas Joshi'}
                  className="w-full h-[500px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-bold text-brand-gold uppercase tracking-widest block">
                    Tax Consultant
                  </span>
                  <h3 className="text-2xl font-bold">{settings?.consultant?.name || 'Mr. Vilas Joshi'}</h3>
                  <p className="text-xs text-slate-300">Vihaan Tax Solutions Lead Advisory</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                eyebrow="Leadership & Vision"
                title="Professional Taxation & Advisory Solutions"
                centered={false}
              />

              <p className="text-slate-600 leading-relaxed text-base">
                {settings?.consultant?.bio ||
                  'With 7+ years of hands-on consultancy experience, Mr. Vilas Joshi has empowered hundreds of business owners, startups, and individual taxpayers with strategic tax planning, statutory GST compliance, meticulous accounting, and proactive financial oversight.'}
              </p>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-navy-900 text-sm mb-2 uppercase tracking-wide">
                  Core Brand Positioning
                </h4>
                <p className="text-brand-blue font-semibold text-lg italic">
                  "{settings?.consultant?.philosophy || 'Trusted. Confidential. Professional.'}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-1" />
                  <div>
                    <h5 className="font-bold text-navy-900 text-sm">Regulatory Accuracy</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Meticulous adherence to tax statutes and filing guidelines.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-1" />
                  <div>
                    <h5 className="font-bold text-navy-900 text-sm">Client Confidentiality</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Strict privacy protocols protecting your sensitive data.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-navy-900 hover:bg-brand-blue text-white font-bold px-6 py-3 rounded-xl shadow-md transition"
                >
                  <span>Book Consultation with Mr. Vilas Joshi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
