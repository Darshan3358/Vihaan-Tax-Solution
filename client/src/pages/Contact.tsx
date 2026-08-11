import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { leadApi } from '../services/api';
import { SEO } from '../components/common/SEO';
import { SectionHeading } from '../components/common/SectionHeading';
import { toast } from 'sonner';

export const Contact: React.FC = () => {
  const { settings } = useCMS();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceName: 'GST Registration',
    customerType: 'Individual' as 'Individual' | 'Business',
    message: '',
    preferredContactMethod: 'Call' as 'Call' | 'WhatsApp' | 'Email',
    preferredContactTime: 'Anytime',
    whatsappConsent: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadNumber, setSubmittedLeadNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please enter all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await leadApi.submitLead(formData);
      if (res.data?.leadNumber) {
        setSubmittedLeadNumber(res.data.leadNumber);
      }
      toast.success(res.message || 'Enquiry submitted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${settings?.whatsapp || '917861096198'}?text=${encodeURIComponent(
    'Hello Vihaan Tax Solutions, I would like to consult regarding tax/GST services.'
  )}`;

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with Mr. Vilas Joshi and the Vihaan Tax Solutions team." />

      <section className="pt-32 pb-16 bg-navy-950 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-gold bg-brand-gold/10 px-3.5 py-1 rounded-full inline-block mb-4">
            Contact Consultancy
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Get in Touch</h1>
          <p className="mt-4 text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
            Book a confidential consultation or ask any question regarding taxation, accounting, or business registration.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-navy-900 mb-2">Vihaan Tax Solutions</h3>
                <p className="text-slate-600 text-sm">
                  {settings?.tagline || 'Trusted, Confidential and Professional Tax & Advisory'}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <Phone className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Phone Consultation</h4>
                    <p className="text-xs text-slate-500 mt-1">Direct call with consultancy</p>
                    <a
                      href={`tel:${settings?.phone || '+917861096198'}`}
                      className="text-base font-bold text-brand-blue hover:underline mt-1 block"
                    >
                      {settings?.phone || '+91 78610 96198'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <Mail className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Email Inquiry</h4>
                    <p className="text-xs text-slate-500 mt-1">Official consultancy inbox</p>
                    <a
                      href={`mailto:${settings?.email || 'Info.vihaantax@gmail.com'}`}
                      className="text-base font-bold text-brand-blue hover:underline mt-1 block"
                    >
                      {settings?.email || 'Info.vihaantax@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <MessageSquare className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">WhatsApp Assistant</h4>
                    <p className="text-xs text-slate-500 mt-1">Instant mobile chat</p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-emerald-600 hover:underline mt-1 block"
                    >
                      Click to chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <MapPin className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Office Address</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {settings?.address || 'Vihaan Tax Solutions Office, India'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-bold text-navy-900 mb-6">Send an Enquiry</h3>

                {submittedLeadNumber ? (
                  <div className="text-center py-8 space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-xl font-bold text-navy-900">Enquiry Received!</h4>
                    <p className="text-slate-600 text-sm">
                      Your Lead Reference Number is <strong>{submittedLeadNumber}</strong>. We will reach out to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Service Required</label>
                      <select
                        value={formData.serviceName}
                        onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      >
                        <option value="GST Registration">GST Registration</option>
                        <option value="GST Return Filing">GST Return Filing</option>
                        <option value="Accounting">Accounting & Bookkeeping</option>
                        <option value="Audit & Assurance">Audit & Assurance</option>
                        <option value="Firm Registration">Firm Registration</option>
                        <option value="ITR Filing">ITR Filing</option>
                        <option value="Other">General Tax Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Message</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Detail your question..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-navy-900 hover:bg-brand-blue text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="mt-16 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            <iframe
              title="Vihaan Tax Solutions Office Location"
              src={settings?.mapEmbedUrl || 'https://maps.google.com/maps?q=India&t=&z=13&ie=UTF8&iwloc=&output=embed'}
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
};
