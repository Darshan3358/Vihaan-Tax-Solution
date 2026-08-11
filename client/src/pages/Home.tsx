import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Award,
  CheckCircle2,
  Phone,
  MessageSquare,
  ChevronDown,
  Star,
  Users,
  Building,
  HelpCircle,
  FileCheck,
  Send,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { serviceApi, testimonialApi, faqApi, leadApi } from '../services/api';
import { IService, ITestimonial, IFAQ } from '../types';
import { SectionHeading } from '../components/common/SectionHeading';
import { IconRenderer } from '../components/common/IconRenderer';
import { SEO } from '../components/common/SEO';
import { toast } from 'sonner';

export const Home: React.FC = () => {
  const { settings } = useCMS();
  const [services, setServices] = useState<IService[]>([]);
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Form State
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
    website_url: '', // Honeypot field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadNumber, setSubmittedLeadNumber] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, testimonialsData, faqsData] = await Promise.all([
          serviceApi.getServices(),
          testimonialApi.getTestimonials(),
          faqApi.getFAQs(),
        ]);
        setServices(servicesData);
        setTestimonials(testimonialsData);
        setFaqs(faqsData);
        if (faqsData.length > 0) {
          setOpenFaqId(faqsData[0]._id);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please fill in all required fields (Name, Phone, Email)');
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
      toast.error(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${settings?.whatsapp || '917861096198'}?text=${encodeURIComponent(
    'Hello Vihaan Tax Solutions, I would like to consult regarding tax/GST services.'
  )}`;

  return (
    <>
      <SEO title="Home" />

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[90vh] pt-32 pb-20 bg-navy-950 text-white flex items-center overflow-hidden">
        {/* Background Overlay & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950/80 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 z-0 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${settings?.hero?.heroImage || '/images/hero.png'})` }}
        />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>{settings?.hero?.eyebrow || 'TAX • GST • ACCOUNTING • BUSINESS ADVISORY'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {settings?.hero?.heading || 'Clarity in Numbers. Confidence in Every Decision.'}
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                {settings?.hero?.description ||
                  'Professional tax, GST, accounting, and business advisory services designed to help individuals and businesses stay compliant, reduce tax burdens, and grow with financial intelligence.'}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#consultation"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-navy-950 font-bold px-8 py-4 rounded-xl shadow-gold-glow hover:shadow-xl transition transform hover:-translate-y-0.5 text-base"
                >
                  <span>{settings?.hero?.ctaPrimary || 'Book a Consultation'}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 bg-navy-800/80 hover:bg-navy-800 text-white font-semibold px-6 py-4 rounded-xl border border-navy-700 hover:border-brand-gold/50 transition text-base"
                >
                  <span>{settings?.hero?.ctaSecondary || 'Explore Services'}</span>
                </a>
              </div>

              {/* Trust Callout */}
              <div className="pt-8 border-t border-navy-800/80 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-brand-gold font-extrabold text-2xl block">
                    {settings?.trustStats?.[0]?.number || '10+'}
                  </span>
                  <span className="text-slate-400 text-xs font-medium">Years Experience</span>
                </div>
                <div>
                  <span className="text-brand-gold font-extrabold text-2xl block">
                    {settings?.trustStats?.[1]?.number || '500+'}
                  </span>
                  <span className="text-slate-400 text-xs font-medium">Clients Assisted</span>
                </div>
                <div>
                  <span className="text-brand-gold font-extrabold text-2xl block">100%</span>
                  <span className="text-slate-400 text-xs font-medium">Confidentiality</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-navy-800 group">
                <img
                  src={settings?.hero?.heroImage || '/images/hero.png'}
                  alt="Tax Consultancy Office"
                  className="w-full h-[450px] object-cover transform group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-navy-900/90 backdrop-blur-md border border-navy-700/80">
                  <div className="flex items-center gap-4">
                    <img
                      src={settings?.consultant?.image || '/images/vilas_joshi.png'}
                      alt={settings?.consultant?.name || 'Mr. Vilas Joshi'}
                      className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {settings?.consultant?.name || 'Mr. Vilas Joshi'}
                      </h4>
                      <p className="text-xs text-brand-gold font-medium">
                        {settings?.consultant?.designation || 'Tax Consultant'}
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1 italic">
                        "{settings?.consultant?.philosophy || 'Trusted. Confidential. Professional.'}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUST STRIP */}
      <section className="bg-brand-blue text-white py-6 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 mx-auto md:mx-0">
              <Shield className="w-6 h-6 text-brand-gold" />
              <span className="font-bold text-base tracking-wide">Trusted • Confidential • Professional</span>
            </div>

            <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Professional Guidance
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Strict Confidentiality
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Compliance Focused
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Client-Centric Approach
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ABOUT CONSULTANCY */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100">
                <img
                  src={settings?.consultant?.image || '/images/vilas_joshi.png'}
                  alt={settings?.consultant?.name || 'Mr. Vilas Joshi'}
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-brand-gold font-bold block">
                    Tax Advisory Practice
                  </span>
                  <h3 className="text-xl font-bold">{settings?.consultant?.name || 'Mr. Vilas Joshi'}</h3>
                  <p className="text-xs text-slate-300">{settings?.consultant?.designation || 'Tax Consultant'}</p>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                eyebrow="Business Philosophy"
                title="Professional Guidance for Every Financial & Tax Decision"
                centered={false}
              />

              <p className="text-slate-600 leading-relaxed text-base">
                {settings?.consultant?.bio ||
                  'At Vihaan Tax Solutions, we believe that understanding taxation and compliance should not be overwhelming. Our consultancy provides structured, confidential, and strategic assistance designed for individuals, growing startups, and established enterprises.'}
              </p>

              <p className="text-slate-600 leading-relaxed text-base">
                Under the leadership of <strong>{settings?.consultant?.name || 'Mr. Vilas Joshi'}</strong>, we ensure that every return filed, audit conducted, and entity registered is handled with complete regulatory accuracy and client confidentiality.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Clear Advisory</h4>
                    <p className="text-xs text-slate-500 mt-1">No complicated jargon; actionable tax guidance.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Full Confidentiality</h4>
                    <p className="text-xs text-slate-500 mt-1">Your financial records are strictly protected.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 font-bold text-brand-blue hover:text-navy-950 transition"
                >
                  <span>Learn more about our practice & philosophy</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CORE SERVICES SHOWCASE */}
      <section id="services" className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Core Services"
            title="Comprehensive Tax & Accounting Solutions"
            subtitle="Professional services designed for individuals, startups, and established companies."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-bl-full transition group-hover:scale-110" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-navy-900 text-brand-gold flex items-center justify-center shadow-md group-hover:bg-brand-blue group-hover:text-white transition duration-300">
                      <IconRenderer name={service.icon} className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      {service.price && (
                        <span className="block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-full border border-emerald-200 shadow-xs mb-1">
                          {service.price}
                        </span>
                      )}
                      <span className="text-2xl font-black text-slate-200 group-hover:text-brand-gold transition">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-brand-blue transition">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                <div>
                  <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                    {service.benefits.slice(0, 2).map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span className="truncate">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center justify-between w-full py-3 px-4 rounded-xl bg-slate-50 text-navy-900 font-bold text-sm hover:bg-navy-900 hover:text-white transition group-hover:bg-navy-900 group-hover:text-white"
                  >
                    <span>{service.ctaText || 'Learn More'}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-brand-blue text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition"
            >
              <span>Explore All 6 Core Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY CHOOSE US */}
      <section className="py-24 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Why Clients Rely on Vihaan Tax Solutions"
            subtitle="Built on credibility, transparency, and a client-centric financial philosophy."
            light={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-brand-gold/40 transition">
              <Award className="w-10 h-10 text-brand-gold mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Trusted Guidance</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Clear, professional advice customized for individual income goals and business scale.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-brand-gold/40 transition">
              <Shield className="w-10 h-10 text-brand-gold mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Strict Confidentiality</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Client financial records and personal data are strictly secured with non-disclosure standards.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-brand-gold/40 transition">
              <FileCheck className="w-10 h-10 text-brand-gold mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Compliance Focus</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Ensuring total adherence to Income Tax Acts, GST laws, and statutory regulatory requirements.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-brand-gold/40 transition">
              <Users className="w-10 h-10 text-brand-gold mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Personalized Attention</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Direct consultation with Mr. Vilas Joshi to address specific tax situations and business questions.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-brand-gold/40 transition">
              <Building className="w-10 h-10 text-brand-gold mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">All Under One Roof</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                GST, ITR, Bookkeeping, Auditing, and Firm Registration handled by a single dedicated consultancy.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-brand-gold/40 transition">
              <MessageSquare className="w-10 h-10 text-brand-gold mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Prompt Communication</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Fast responses over Phone, Email, and WhatsApp for ongoing client inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CONSULTANT PROFILE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-bg rounded-3xl p-8 md:p-12 border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-4 text-center lg:text-left">
                <img
                  src={settings?.consultant?.image || '/images/vilas_joshi.png'}
                  alt={settings?.consultant?.name || 'Mr. Vilas Joshi'}
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover mx-auto lg:mx-0 border-4 border-brand-gold shadow-xl"
                />
                <h3 className="text-2xl font-extrabold text-navy-900 mt-6">
                  {settings?.consultant?.name || 'Mr. Vilas Joshi'}
                </h3>
                <p className="text-brand-blue font-bold text-sm">
                  {settings?.consultant?.designation || 'Tax Consultant'}
                </p>
                <div className="mt-3 inline-block bg-brand-gold/15 text-brand-gold font-bold px-3 py-1 rounded-full text-xs">
                  {settings?.consultant?.experienceYears || '10+'} Years Professional Experience
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-brand-gold">
                  Consultant Profile
                </span>
                <h2 className="text-3xl font-bold text-navy-900">
                  Strategic Tax & Accounting Assistance You Can Rely On
                </h2>
                <p className="text-slate-600 leading-relaxed text-base">
                  {settings?.consultant?.bio ||
                    'With extensive practical experience in Indian tax laws, GST filing, statutory audit standards, and business incorporation, Mr. Vilas Joshi works closely with clients to navigate complex compliance regulations effortlessly.'}
                </p>

                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-slate-700 italic font-medium text-sm leading-relaxed">
                    "{settings?.consultant?.philosophy ||
                      'Trusted. Confidential. Professional. Every financial decision deserves clarity, strategic depth, and total regulatory adherence.'}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Client Reviews"
              title="What Our Clients Say"
              subtitle="Feedback from business owners and individuals who trust Vihaan Tax Solutions."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test) => (
                <div
                  key={test._id}
                  className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {[...Array(test.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{test.content}"</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy-900 text-brand-gold font-bold flex items-center justify-center text-sm">
                      {test.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 text-sm">{test.name}</h4>
                      <p className="text-xs text-slate-500">
                        {test.designation} {test.company ? `• ${test.company}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 8: FAQ ACCORDION */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            subtitle="Get instant answers regarding GST, ITR, accounting, and business registration."
          />

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq._id;
              return (
                <div
                  key={faq._id}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq._id)}
                    className="w-full text-left p-6 bg-slate-50/50 hover:bg-slate-100/50 flex justify-between items-center transition"
                  >
                    <span className="font-bold text-navy-900 text-base md:text-lg pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-brand-blue shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-6 bg-white border-t border-slate-100 text-slate-600 text-sm leading-relaxed animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link to="/faq" className="text-sm font-bold text-brand-blue hover:underline">
              View All Frequently Asked Questions →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: LEAD CONSULTATION FORM */}
      <section id="consultation" className="py-24 bg-navy-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Form Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-brand-gold">
                Consultation Enquiry
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Request a Confidential Tax Consultation
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Fill out your details below and our team will get in touch with you promptly to discuss your requirements.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-slate-200 text-sm">
                  <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                  <span>{settings?.phone || '+91 78610 96198'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200 text-sm">
                  <MessageSquare className="w-5 h-5 text-brand-gold shrink-0" />
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Direct WhatsApp Consultation
                  </a>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="lg:col-span-7">
              <div className="bg-white text-navy-900 rounded-3xl p-8 shadow-2xl border border-slate-100">
                {submittedLeadNumber ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-navy-900">Thank You!</h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto">
                      Your enquiry has been received successfully. Reference Lead ID:{' '}
                      <strong className="text-brand-blue">{submittedLeadNumber}</strong>. Our team will contact you shortly.
                    </p>
                    <div className="pt-4 flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setSubmittedLeadNumber(null);
                          setFormData((prev) => ({ ...prev, message: '' }));
                        }}
                        className="bg-navy-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm"
                      >
                        Submit Another Enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Honeypot field for anti-spam */}
                    <input
                      type="text"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="rahul@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          Service Required
                        </label>
                        <select
                          name="serviceName"
                          value={formData.serviceName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm bg-white"
                        >
                          <option value="GST Registration">GST Registration</option>
                          <option value="GST Return Filing">GST Return Filing</option>
                          <option value="Accounting">Accounting & Bookkeeping</option>
                          <option value="Audit & Assurance">Audit & Assurance</option>
                          <option value="Firm Registration">Firm / Business Registration</option>
                          <option value="ITR Filing">Income Tax Return (ITR) Filing</option>
                          <option value="Other">General Tax Consultation</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                        Message / Query Details
                      </label>
                      <textarea
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Briefly describe your requirements or tax question..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="whatsappConsent"
                        name="whatsappConsent"
                        checked={formData.whatsappConsent}
                        onChange={handleInputChange}
                        className="rounded text-brand-blue focus:ring-brand-blue"
                      />
                      <label htmlFor="whatsappConsent" className="text-xs text-slate-600">
                        I agree to receive consultation updates over WhatsApp & phone.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-navy-950 font-bold py-4 rounded-xl shadow-gold-glow transition flex items-center justify-center gap-2 text-base"
                    >
                      {isSubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Submit Consultation Request</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
