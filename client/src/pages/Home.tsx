import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  ExternalLink,
  Globe,
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
  const [reviewTab, setReviewTab] = useState<'live' | 'mock'>('live');

  useEffect(() => {
    if (settings?.reviewSource) {
      setReviewTab(settings.reviewSource);
    }
  }, [settings?.reviewSource]);

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

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <SEO title="Home" />

      {/* SECTION 1: HERO (Enhanced Contrast, Ambient Glow & Micro-Animations) */}
      <section className="relative min-h-[85vh] pt-28 pb-16 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-900 via-navy-950 to-navy-950 text-white flex items-center overflow-hidden">
        {/* Background Ambient Lighting & Gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/85 to-navy-950/70 z-10" />

        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 z-0 scale-105"
          style={{ backgroundImage: `url(${settings?.hero?.heroImage || '/images/hero.png'})` }}
        />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-5"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{settings?.hero?.eyebrow || 'TAX • GST • ACCOUNTING • BUSINESS ADVISORY'}</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                {settings?.hero?.heading || 'Clarity in Numbers. Confidence in Every Decision.'}
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                {settings?.hero?.description ||
                  'Professional tax, GST, accounting, and business advisory services designed to help individuals and businesses stay compliant, reduce tax burdens, and grow with financial intelligence.'}
              </motion.p>

              {/* CTAs with clear primary/secondary hierarchy */}
              <motion.div variants={fadeInUp} className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#consultation"
                  className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-brand-gold via-amber-400 to-amber-500 text-navy-950 font-extrabold px-8 py-4 rounded-xl shadow-gold-glow hover:shadow-2xl transition transform hover:-translate-y-0.5 text-base active:scale-95"
                >
                  <span>{settings?.hero?.ctaPrimary || 'Book a Consultation'}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 bg-slate-900/60 hover:bg-slate-900 text-slate-200 hover:text-white font-semibold px-6 py-4 rounded-xl border border-slate-700/80 hover:border-slate-500 transition text-base"
                >
                  <span>{settings?.hero?.ctaSecondary || 'Explore Services'}</span>
                </a>
              </motion.div>

              {/* Stat Counter Strip */}
              <motion.div variants={fadeInUp} className="pt-6 border-t border-navy-800/80 grid grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-navy-900/40 border border-navy-800/60 backdrop-blur-xs">
                  <span className="text-brand-gold font-black text-2xl block tracking-tight">
                    {settings?.trustStats?.[0]?.number || '7+'}
                  </span>
                  <span className="text-slate-400 text-xs font-medium">Years Experience</span>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/40 border border-navy-800/60 backdrop-blur-xs">
                  <span className="text-brand-gold font-black text-2xl block tracking-tight">
                    {settings?.trustStats?.[1]?.number || '500+'}
                  </span>
                  <span className="text-slate-400 text-xs font-medium">Clients Assisted</span>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/40 border border-navy-800/60 backdrop-blur-xs">
                  <span className="text-brand-gold font-black text-2xl block tracking-tight">100%</span>
                  <span className="text-slate-400 text-xs font-medium">Confidentiality</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual Card with Gold Border & Hover Float */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-brand-gold/30 group">
                <img
                  src={settings?.hero?.heroImage || '/images/hero.png'}
                  alt="Tax Consultancy Office"
                  className="w-full h-[420px] object-cover transform group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-navy-900/95 backdrop-blur-md border border-navy-700/80 shadow-xl">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={settings?.consultant?.image || '/images/vilas_joshi.png'}
                      alt={settings?.consultant?.name || 'Mr. Vilas Joshi'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold shadow-md shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base leading-snug">
                        {settings?.consultant?.name || 'Mr. Vilas Joshi'}
                      </h4>
                      <p className="text-xs text-brand-gold font-medium">
                        {settings?.consultant?.designation || 'Tax Consultant'}
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5 italic">
                        "{settings?.consultant?.philosophy || 'Trusted. Confidential. Professional.'}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUST STRIP */}
      <section className="bg-navy-900 text-white py-4 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-4 text-center md:text-left">
            <div className="flex items-center gap-3 mx-auto md:mx-0">
              <Shield className="w-5 h-5 text-brand-gold" />
              <span className="font-bold text-sm tracking-wide">Trusted • Confidential • Professional</span>
            </div>

            <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
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

      {/* SECTION 3: ABOUT CONSULTANCY (Tightened Vertical Spacing) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                <img
                  src={settings?.consultant?.image || '/images/vilas_joshi.png'}
                  alt={settings?.consultant?.name || 'Mr. Vilas Joshi'}
                  className="w-full h-[420px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-xs uppercase tracking-widest text-brand-gold font-bold block">
                    Tax Advisory Practice
                  </span>
                  <h3 className="text-xl font-bold">{settings?.consultant?.name || 'Mr. Vilas Joshi'}</h3>
                  <p className="text-xs text-slate-300">{settings?.consultant?.designation || 'Tax Consultant'}</p>
                </div>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-5"
            >
              <SectionHeading
                eyebrow="Business Philosophy"
                title="Professional Guidance for Every Financial & Tax Decision"
                centered={false}
              />

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {settings?.consultant?.bio ||
                  'At Vihaan Tax Solutions, we believe that understanding taxation and compliance should not be overwhelming. Our consultancy provides structured, confidential, and strategic assistance designed for individuals, growing startups, and established enterprises.'}
              </p>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Under the leadership of <strong>{settings?.consultant?.name || 'Mr. Vilas Joshi'}</strong>, we ensure that every return filed, audit conducted, and entity registered is handled with complete regulatory accuracy and client confidentiality.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Clear Advisory</h4>
                    <p className="text-xs text-slate-500 mt-0.5">No complicated jargon; actionable tax guidance.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Full Confidentiality</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Your financial records are strictly protected.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 font-bold text-brand-blue hover:text-navy-950 transition text-sm"
                >
                  <span>Learn more about our practice & philosophy</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CORE SERVICES SHOWCASE */}
      <section id="services" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Core Services"
            title="Comprehensive Tax & Accounting Solutions"
            subtitle="Professional services designed for individuals, startups, and established companies."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-blue/5 rounded-bl-full transition group-hover:scale-110" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-navy-900 text-brand-gold flex items-center justify-center shadow-md group-hover:bg-brand-blue group-hover:text-white transition duration-300">
                      <IconRenderer name={service.icon} className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      {service.price && (
                        <span className="block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-full border border-emerald-200 shadow-xs mb-1">
                          {service.price}
                        </span>
                      )}
                      <span className="text-xl font-black text-slate-300 group-hover:text-brand-gold transition">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-brand-blue transition">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                <div>
                  <div className="space-y-1.5 mb-5 pt-3 border-t border-slate-100">
                    {service.benefits.slice(0, 2).map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span className="truncate">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-slate-50 text-navy-900 font-bold text-xs hover:bg-navy-900 hover:text-white transition group-hover:bg-navy-900 group-hover:text-white"
                  >
                    <span>{service.ctaText || 'Learn More'}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-brand-blue text-white font-bold px-7 py-3 rounded-xl shadow-md transition text-sm"
            >
              <span>Explore All 10 Core Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY CHOOSE US */}
      <section className="py-16 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Why Clients Rely on Vihaan Tax Solutions"
            subtitle="Built on credibility, transparency, and a client-centric financial philosophy."
            light={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Trusted Guidance', text: 'Clear, professional advice customized for individual income goals and business scale.' },
              { icon: Shield, title: 'Strict Confidentiality', text: 'Client financial records and personal data are strictly secured with non-disclosure standards.' },
              { icon: FileCheck, title: 'Compliance Focus', text: 'Ensuring total adherence to Income Tax Acts, GST laws, and statutory regulatory requirements.' },
              { icon: Users, title: 'Personalized Attention', text: 'Direct consultation with Mr. Vilas Joshi to address specific tax situations and business questions.' },
              { icon: Building, title: 'All Under One Roof', text: 'GST, ITR, Bookkeeping, Auditing, and Firm Registration handled by a single dedicated consultancy.' },
              { icon: MessageSquare, title: 'Prompt Communication', text: 'Fast responses over Phone, Email, and WhatsApp for ongoing client inquiries.' },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-brand-gold/40 transition"
                >
                  <IconComp className="w-8 h-8 text-brand-gold mb-3" />
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: CONSULTANT PROFILE (Tightened Spacing) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 text-center lg:text-left">
                <img
                  src={settings?.consultant?.image || '/images/vilas_joshi.png'}
                  alt={settings?.consultant?.name || 'Mr. Vilas Joshi'}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover object-top mx-auto lg:mx-0 border-4 border-brand-gold shadow-md"
                />
                <h3 className="text-xl font-extrabold text-navy-900 mt-4">
                  {settings?.consultant?.name || 'Mr. Vilas Joshi'}
                </h3>
                <p className="text-brand-blue font-bold text-xs sm:text-sm">
                  {settings?.consultant?.designation || 'Tax Consultant'}
                </p>
                <div className="mt-2 inline-block bg-brand-gold/15 text-brand-gold font-bold px-3 py-1 rounded-full text-[11px]">
                  {settings?.consultant?.experienceYears || '10+'} Years Professional Experience
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs uppercase tracking-widest font-bold text-brand-gold">
                  Consultant Profile
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
                  Strategic Tax & Accounting Assistance You Can Rely On
                </h2>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  {settings?.consultant?.bio ||
                    'With extensive practical experience in Indian tax laws, GST filing, statutory audit standards, and business incorporation, Mr. Vilas Joshi works closely with clients to navigate complex compliance regulations effortlessly.'}
                </p>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <p className="text-slate-700 italic font-medium text-xs sm:text-sm leading-relaxed">
                    "{settings?.consultant?.philosophy ||
                      'Trusted. Confidential. Professional. Every financial decision deserves clarity, strategic depth, and total regulatory adherence.'}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: TESTIMONIALS & GOOGLE REVIEWS */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeading
              eyebrow="Client Reviews & Ratings"
              title="What Our Clients Say"
              subtitle="Feedback from business owners and individuals who trust Vihaan Tax Solutions."
            />

            {/* Mode Switcher Tabs & Google Summary Banner */}
            <div className="mb-10 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setReviewTab('live')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                      reviewTab === 'live'
                        ? 'bg-navy-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Live Google Reviews</span>
                    <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold">5.0 ★</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewTab('mock')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                      reviewTab === 'mock'
                        ? 'bg-navy-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-brand-gold" />
                    <span>Mock / Custom</span>
                  </button>
                </div>

                {reviewTab === 'live' && (
                  <a
                    href={settings?.googlePlaceUrl || 'https://www.google.com/search?q=vihaan-tax-solution+baroda'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-brand-blue hover:text-navy-900 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    <span>117+ Reviews on Google</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(reviewTab === 'live'
                ? testimonials.filter((t) => t.isGoogleReview).length > 0
                  ? testimonials.filter((t) => t.isGoogleReview)
                  : testimonials
                : testimonials.filter((t) => !t.isGoogleReview).length > 0
                ? testimonials.filter((t) => !t.isGoogleReview)
                : testimonials
              ).map((test) => (
                <motion.div
                  key={test._id}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden"
                >
                  {test.isGoogleReview && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Google Review</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(test.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 italic">"{test.content}"</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-navy-900 text-brand-gold font-bold flex items-center justify-center text-xs shrink-0">
                      {test.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-navy-900 text-xs sm:text-sm truncate">{test.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {test.designation} {test.company ? `• ${test.company}` : ''}
                      </p>
                      {test.timeAgo && <span className="text-[10px] text-slate-400 block">{test.timeAgo}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href={settings?.googlePlaceUrl || 'https://www.google.com/search?q=vihaan-tax-solution+baroda'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-navy-900 border border-slate-300 font-bold px-5 py-2.5 rounded-xl shadow-xs text-xs transition"
              >
                <span>View All 117+ Google Reviews & Post Feedback</span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-blue" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 8: FAQ ACCORDION (Visually Prominent Accordions) */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            subtitle="Get instant answers regarding GST, ITR, accounting, and business registration."
          />

          <div className="space-y-3.5">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq._id;
              return (
                <div
                  key={faq._id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-brand-gold/60 shadow-md bg-amber-50/20'
                      : 'border-slate-200/80 hover:border-slate-300 bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq._id)}
                    className="w-full text-left p-5 flex justify-between items-center transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-navy-900 text-brand-gold text-[10px] font-bold tracking-wider uppercase">
                        {faq.category || 'TAX'}
                      </span>
                      <span className="font-bold text-navy-900 text-sm sm:text-base pr-2">
                        {faq.question}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-brand-gold text-navy-950 rotate-180' : 'bg-slate-100 text-slate-600'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 pt-1 border-t border-slate-100 text-slate-600 text-xs sm:text-sm leading-relaxed"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link to="/faq" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline">
              <span>View All Frequently Asked Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: LEAD CONSULTATION FORM */}
      <section id="consultation" className="py-16 bg-navy-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Form Info */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs uppercase tracking-widest font-bold text-brand-gold">
                Consultation Enquiry
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Request a Confidential Tax Consultation
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Fill out your details below and our team will get in touch with you promptly to discuss your requirements.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-slate-200 text-sm">
                  <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>{settings?.phone || '+91 78610 96198'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200 text-sm">
                  <MessageSquare className="w-4 h-4 text-brand-gold shrink-0" />
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-400 font-semibold">
                    Direct WhatsApp Consultation
                  </a>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="lg:col-span-7">
              <div className="bg-white text-navy-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
                {submittedLeadNumber ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-navy-900">Thank You!</h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto">
                      Your enquiry has been received successfully. Reference Lead ID:{' '}
                      <strong className="text-brand-blue">{submittedLeadNumber}</strong>. Our team will contact you shortly.
                    </p>
                    <div className="pt-2 flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setSubmittedLeadNumber(null);
                          setFormData((prev) => ({ ...prev, message: '' }));
                        }}
                        className="bg-navy-900 text-white px-5 py-2 rounded-xl font-bold text-xs"
                      >
                        Submit Another Enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="rahul@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Service Required
                        </label>
                        <select
                          name="serviceName"
                          value={formData.serviceName}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm bg-white"
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
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Message / Query Details
                      </label>
                      <textarea
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Briefly describe your requirements or tax question..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
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
                      className="w-full bg-gradient-to-r from-brand-gold via-amber-400 to-amber-500 hover:from-amber-500 hover:to-brand-gold text-navy-950 font-extrabold py-3.5 rounded-xl shadow-gold-glow transition flex items-center justify-center gap-2 text-base active:scale-95"
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
