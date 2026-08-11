import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MessageSquare, Menu, X, Award } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export const Header: React.FC = () => {
  const { settings } = useCMS();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const whatsappNumber = settings?.whatsapp || '917861096198';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Vihaan Tax Solutions, I would like to enquire about your professional tax & GST services.'
  )}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top Bar */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 border-b border-navy-900 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`tel:${settings?.phone || '+917861096198'}`} className="flex items-center gap-1.5 hover:text-brand-gold transition">
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              <span>{settings?.phone || '+91 78610 96198'}</span>
            </a>
            <a href={`mailto:${settings?.email || 'Info.vihaantax@gmail.com'}`} className="flex items-center gap-1.5 hover:text-brand-gold transition">
              <Mail className="w-3.5 h-3.5 text-brand-gold" />
              <span>{settings?.email || 'Info.vihaantax@gmail.com'}</span>
            </a>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Award className="w-3.5 h-3.5 text-brand-gold" />
              <span>Consultant: {settings?.consultant?.name || 'Mr. Vilas Joshi'}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">{settings?.officeHours || 'Mon - Sat: 9:30 AM - 7:00 PM'}</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 font-medium hover:text-emerald-300 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'glass-nav text-white shadow-xl py-3 border-b border-navy-800'
            : 'bg-navy-900/90 text-white backdrop-blur-md py-4 border-b border-navy-800/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-amber-600 flex items-center justify-center text-navy-950 font-black text-xl shadow-gold-glow group-hover:scale-105 transition">
              V
            </div>
            <div>
              <span className="font-extrabold text-lg md:text-xl tracking-tight text-white block leading-none">
                {settings?.companyName || 'Vihaan Tax Solutions'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-brand-gold font-semibold block mt-1">
                CA & Tax Consultancy
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`py-2 hover:text-brand-gold transition ${
                  (link.path === '/services' ? location.pathname.startsWith('/services') : location.pathname === link.path)
                    ? 'text-brand-gold font-semibold'
                    : 'text-slate-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition border border-emerald-500/30"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-navy-950 font-bold px-5 py-2.5 rounded-xl shadow-gold-glow hover:shadow-lg transition transform hover:-translate-y-0.5 text-sm"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-200 hover:text-white hover:bg-navy-800 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-navy-950/95 backdrop-blur-xl z-40 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-2">
                Navigation
              </span>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block py-2.5 text-lg font-medium text-slate-100 hover:text-brand-gold transition border-b border-navy-800"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-navy-800 space-y-3">
            <Link
              to="/contact"
              className="block text-center w-full bg-brand-gold text-navy-950 font-bold py-3 rounded-xl shadow-gold-glow"
            >
              Book Consultation
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold py-2.5 rounded-xl"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Consultant</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
