import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageSquare, Clock, Shield } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export const Footer: React.FC = () => {
  const { settings } = useCMS();

  const coreServices = [
    { name: 'GST Registration', path: '/services/gst-registration' },
    { name: 'GST Return Filing', path: '/services/gst-return-filing' },
    { name: 'Accounting & Bookkeeping', path: '/services/accounting' },
    { name: 'Audit & Assurance', path: '/services/audit-assurance' },
    { name: 'Firm & Company Registration', path: '/services/firm-registration' },
    { name: 'Income Tax Return (ITR) Filing', path: '/services/itr-filing' },
  ];

  const whatsappUrl = `https://wa.me/${settings?.whatsapp || '917861096198'}?text=${encodeURIComponent(
    'Hello Vihaan Tax Solutions, I would like assistance with your services.'
  )}`;

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Vihaan Tax Solution Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <span className="font-extrabold text-xl text-white block">
                  {settings?.companyName || 'Vihaan Tax Solutions'}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-semibold block">
                  CA & Tax Consultancy
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings?.tagline ||
                'Trusted, Confidential and Professional tax, GST, accounting, and financial advisory under one roof.'}
            </p>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-gold bg-brand-gold/10 p-2.5 rounded-lg border border-brand-gold/20">
                <Shield className="w-4 h-4" />
                <span>Client Confidentiality Assured</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-navy-800 pb-2">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-gold transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-gold transition">
                  About Consultancy
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-gold transition">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-gold transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-gold transition">
                  Book Consultation
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-500 hover:text-slate-300 transition text-xs">
                  Admin CMS Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Services */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-navy-800 pb-2">Core Services</h4>
            <ul className="space-y-2.5 text-sm">
              {coreServices.map((s) => (
                <li key={s.path}>
                  <Link to={s.path} className="hover:text-brand-gold transition flex items-center gap-1.5">
                    <span className="text-brand-gold text-xs">•</span>
                    <span>{s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Consultant Details */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-navy-800 pb-2">Contact Details</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <span className="text-slate-400">{settings?.address || 'Vihaan Tax Solutions Office, India'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={`tel:${settings?.phone || '+917861096198'}`} className="hover:text-white transition">
                  {settings?.phone || '+91 78610 96198'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={`mailto:${settings?.email || 'Info.vihaantax@gmail.com'}`} className="hover:text-white transition">
                  {settings?.email || 'Info.vihaantax@gmail.com'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="text-slate-400">{settings?.officeHours || 'Mon - Sat: 9:30 AM - 7:00 PM'}</span>
              </li>
              <li className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Direct WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Vihaan Tax Solutions. All Rights Reserved. Consultancy by {settings?.consultant?.name || 'Mr. Vilas Joshi'}.</p>

          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-400 transition">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-slate-400 transition">
              Terms & Conditions
            </Link>
            <Link to="/disclaimer" className="hover:text-slate-400 transition">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
