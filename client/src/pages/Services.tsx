import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Search, Tag } from 'lucide-react';
import { serviceApi } from '../services/api';
import { IService } from '../types';
import { SEO } from '../components/common/SEO';
import { IconRenderer } from '../components/common/IconRenderer';

export const Services: React.FC = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceApi.getServices();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = ['ALL', ...Array.from(new Set(services.map((s) => s.category).filter(Boolean)))];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO title="Services & Pricing" description="Explore our 10 official tax, GST, accounting, audit, trademark, and registration services with transparent pricing." />

      <section className="pt-32 pb-16 bg-navy-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-gold bg-brand-gold/10 px-3.5 py-1 rounded-full inline-block mb-4">
            Official Practice Portfolio & Pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Tax, GST & Business Advisory Services</h1>
          <p className="mt-4 text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
            Transparent pricing and professional tax advisory by Mr. Vilas Joshi in Vadodara, Gujarat.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search services (e.g. GST Registration ₹2500, ITR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-4" />
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat!)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-brand-gold text-navy-950 shadow-md'
                    : 'bg-navy-900/80 text-slate-300 hover:bg-navy-800 hover:text-white border border-navy-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-slate-200 animate-shimmer" />
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <p className="text-slate-500 font-bold">No services found matching your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-card-hover transition duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-navy-900 text-brand-gold flex items-center justify-center shadow-md group-hover:bg-brand-blue group-hover:text-white transition duration-300">
                        <IconRenderer name={service.icon} className="w-7 h-7" />
                      </div>
                      <span className="text-2xl font-black text-slate-200 group-hover:text-brand-gold transition">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Category & Price Badge */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-blue bg-blue-50 px-2.5 py-1 rounded-md">
                        {service.category}
                      </span>
                      {service.price && (
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-xs">
                          {service.price}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-brand-blue transition">
                      {service.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div>
                    <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                      {service.benefits.slice(0, 3).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center justify-between w-full py-3 px-4 rounded-xl bg-slate-50 text-navy-900 font-bold text-sm hover:bg-navy-900 hover:text-white transition"
                    >
                      <span>{service.ctaText || 'View Details & Pricing'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
