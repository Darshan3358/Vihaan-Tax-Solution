import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export const MobileStickyBar: React.FC = () => {
  const { settings } = useCMS();

  const phoneUrl = `tel:${settings?.phone || '+917861096198'}`;
  const whatsappUrl = `https://wa.me/${settings?.whatsapp || '917861096198'}?text=${encodeURIComponent(
    'Hello Vihaan Tax Solutions, I would like to consult regarding tax/GST services.'
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-lg border-t border-navy-800 p-2 shadow-2xl">
      <div className="grid grid-cols-3 gap-2">
        <a
          href={phoneUrl}
          className="flex flex-col items-center justify-center py-2 px-1 bg-navy-800 text-white rounded-xl text-xs font-semibold hover:bg-navy-700 transition"
        >
          <Phone className="w-4 h-4 text-brand-gold mb-1" />
          <span>Call Now</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 bg-emerald-600/90 text-white rounded-xl text-xs font-semibold hover:bg-emerald-500 transition"
        >
          <MessageSquare className="w-4 h-4 text-emerald-200 mb-1" />
          <span>WhatsApp</span>
        </a>

        <Link
          to="/contact"
          className="flex flex-col items-center justify-center py-2 px-1 bg-brand-gold text-navy-950 rounded-xl text-xs font-bold shadow-gold-glow hover:bg-amber-400 transition"
        >
          <Calendar className="w-4 h-4 text-navy-950 mb-1" />
          <span>Enquire</span>
        </Link>
      </div>
    </div>
  );
};
