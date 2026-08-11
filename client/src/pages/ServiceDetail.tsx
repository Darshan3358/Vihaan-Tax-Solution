import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
  Send,
  HelpCircle,
} from 'lucide-react';
import { serviceApi, leadApi } from '../services/api';
import { IService } from '../types';
import { SEO } from '../components/common/SEO';
import { IconRenderer } from '../components/common/IconRenderer';
import { Modal } from '../components/common/Modal';
import { toast } from 'sonner';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<IService | null>(null);
  const [allServices, setAllServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state inside modal
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    customerType: 'Individual' as 'Individual' | 'Business',
    message: '',
    preferredContactMethod: 'Call' as 'Call' | 'WhatsApp' | 'Email',
    whatsappConsent: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const [serviceData, servicesList] = await Promise.all([
          serviceApi.getServiceBySlug(slug),
          serviceApi.getServices(),
        ]);
        setService(serviceData);
        setAllServices(servicesList);
      } catch (err) {
        console.error('Error fetching service details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please enter Name, Phone, and Email');
      return;
    }

    setIsSubmitting(true);
    try {
      await leadApi.submitLead({
        ...formData,
        serviceName: service?.title || 'General Consultation',
      });
      toast.success('Your consultation request has been submitted successfully!');
      setIsModalOpen(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        customerType: 'Individual',
        message: '',
        preferredContactMethod: 'Call',
        whatsappConsent: true,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
        <div className="h-64 rounded-2xl bg-slate-200 animate-shimmer mb-8" />
        <div className="h-96 rounded-2xl bg-slate-200 animate-shimmer" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4">
        <h2 className="text-2xl font-bold text-navy-900 mb-4">Service Not Found</h2>
        <p className="text-slate-600 mb-6">The requested service page does not exist or may have been moved.</p>
        <Link to="/services" className="bg-navy-900 text-white font-bold px-6 py-3 rounded-xl">
          Back to All Services
        </Link>
      </div>
    );
  }

  const relatedServices = allServices.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <SEO
        title={service.seo?.metaTitle || service.title}
        description={service.seo?.metaDescription || service.shortDescription}
      />

      {/* Hero Banner & Breadcrumbs */}
      <section className="pt-32 pb-16 bg-navy-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link to="/" className="hover:text-brand-gold">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/services" className="hover:text-brand-gold">
              Services
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-gold font-semibold">{service.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-14 h-14 rounded-2xl bg-brand-gold text-navy-950 flex items-center justify-center font-bold shadow-gold-glow">
                  <IconRenderer name={service.icon} className="w-7 h-7" />
                </div>
                {service.category && (
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-md border border-brand-gold/20">
                    {service.category}
                  </span>
                )}
                {service.price && (
                  <span className="text-sm font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1 rounded-full shadow-md">
                    {service.price}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">{service.title}</h1>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
                {service.shortDescription}
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-navy-950 font-bold px-8 py-3.5 rounded-xl shadow-gold-glow transition flex items-center gap-2"
                >
                  <span>{service.ctaText || 'Get Started Now'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0" />
                  <span>100% Tax & Legal Compliance Guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brand-gold shrink-0" />
                  <span>Timely Filing & Fast Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-brand-gold shrink-0" />
                  <span>Consultant Guidance by Mr. Vilas Joshi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              {/* Detailed Overview */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4 border-b border-slate-100 pb-3">
                  Service Overview
                </h2>
                <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Key Benefits Grid */}
              {service.benefits && service.benefits.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 border-b border-slate-100 pb-3">
                    Key Advantages & Benefits
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.benefits.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-800">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5-Step Execution Process Timeline */}
              {service.process && service.process.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 border-b border-slate-100 pb-3">
                    Step-by-Step Process Timeline
                  </h2>

                  <div className="space-y-6">
                    {service.process.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-6 group hover:border-brand-blue transition"
                      >
                        <div className="w-12 h-12 rounded-xl bg-navy-900 text-brand-gold font-black text-lg flex items-center justify-center shrink-0 group-hover:bg-brand-blue group-hover:text-white transition">
                          {step.stepNumber}
                        </div>
                        <div>
                          <h4 className="font-bold text-navy-900 text-base mb-1">{step.title}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents Required List */}
              {service.documents && service.documents.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 border-b border-slate-100 pb-3">
                    Documents Required
                  </h2>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                      {service.documents.map((doc, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-brand-gold shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar CTA Card */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-navy-950 text-white rounded-3xl p-8 shadow-xl border border-navy-800 sticky top-28">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-gold block mb-2">
                  Ready to proceed?
                </span>
                <h3 className="text-2xl font-bold mb-4">Request {service.title}</h3>
                <p className="text-slate-300 text-xs mb-6 leading-relaxed">
                  Get personalized guidance from Mr. Vilas Joshi and complete your compliance with total peace of mind.
                </p>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-navy-950 font-bold py-3.5 rounded-xl shadow-gold-glow transition flex items-center justify-center gap-2 text-sm mb-4"
                >
                  <span>{service.ctaText || 'Submit Requirement'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <a
                    href={`https://wa.me/917861096198?text=${encodeURIComponent(
                      `Hello, I would like to enquire about ${service.title}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 font-semibold hover:underline"
                  >
                    Or chat instantly on WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services Footer Strip */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-navy-900 mb-6">Explore Other Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rs) => (
                <Link
                  key={rs._id}
                  to={`/services/${rs.slug}`}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-brand-blue transition group"
                >
                  <h4 className="font-bold text-navy-900 text-base mb-2 group-hover:text-brand-blue">
                    {rs.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{rs.shortDescription}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Enquire: ${service.title}`}
      >
        <form onSubmit={handleSubmitLead} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Additional Message / Note</label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your business or specific filing requirement..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-gold text-navy-950 font-bold py-3 rounded-xl shadow-md hover:bg-amber-400 transition"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </Modal>
    </>
  );
};
