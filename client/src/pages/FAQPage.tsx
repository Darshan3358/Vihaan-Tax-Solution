import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { faqApi } from '../services/api';
import { IFAQ } from '../types';
import { SEO } from '../components/common/SEO';
import { SectionHeading } from '../components/common/SectionHeading';

export const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await faqApi.getFAQs();
        setFaqs(data);
        if (data.length > 0) setOpenId(data[0]._id);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      }
    };
    fetchFaqs();
  }, []);

  const categories = ['ALL', 'GST', 'ITR', 'Accounting', 'Business Registration', 'Audit', 'General'];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = activeCategory === 'ALL' || f.category === activeCategory;
    const matchesSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEO title="FAQ" description="Frequently Asked Questions on Tax, GST, Accounting, and Business Registration." />

      <section className="pt-32 pb-16 bg-navy-950 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-gold bg-brand-gold/10 px-3.5 py-1 rounded-full inline-block mb-4">
            Help & Resources
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Frequently Asked Questions</h1>
          <p className="mt-4 text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
            Find clear answers to common questions about GST returns, Income Tax filing, bookkeeping, and firm registration.
          </p>

          <div className="mt-8 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search questions (e.g. GST late fee, Old vs New regime)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeCategory === cat
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No matching questions found.</p>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openId === faq._id;
                return (
                  <div key={faq._id} className="rounded-2xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setOpenId(isOpen ? null : faq._id)}
                      className="w-full text-left p-6 bg-slate-50/50 hover:bg-slate-100/50 flex justify-between items-center transition"
                    >
                      <span className="font-bold text-navy-900 text-base md:text-lg pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-brand-blue shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-6 bg-white border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
};
