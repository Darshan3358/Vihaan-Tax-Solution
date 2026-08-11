import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Briefcase } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const NotFound: React.FC = () => {
  return (
    <>
      <SEO title="Page Not Found (404)" />
      <section className="min-h-[80vh] pt-32 pb-20 flex items-center justify-center bg-brand-bg text-center">
        <div className="max-w-md mx-auto px-4">
          <div className="w-24 h-24 rounded-full bg-navy-900 text-brand-gold font-extrabold text-4xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            404
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 mb-2">Page Not Found</h1>
          <p className="text-slate-600 text-sm mb-8">
            The page you are looking for might have been moved, renamed, or no longer exists.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-blue transition text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-navy-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition text-sm"
            >
              <Briefcase className="w-4 h-4" />
              <span>View Services</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
