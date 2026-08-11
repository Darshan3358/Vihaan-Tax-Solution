import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Service } from '../models/Service';
import { Testimonial } from '../models/Testimonial';
import { FAQ } from '../models/FAQ';
import { Setting } from '../models/Setting';
import { Lead } from '../models/Lead';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://fanqie:fanqie123@cluster0.f8acy45.mongodb.net/tax';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected successfully.');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Testimonial.deleteMany({});
    await FAQ.deleteMany({});
    await Setting.deleteMany({});
    await Lead.deleteMany({});
    console.log('[Seed] Cleared existing collections.');

    // 1. Create Super Admin
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('Admin@123456', salt);
    await User.create({
      name: 'Mr. Vilas Joshi (Admin)',
      email: 'admin@vihaantax.com',
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    });
    console.log('[Seed] Admin user created: admin@vihaantax.com / Admin@123456');

    // 2. Create Real Products & Services from Google Business Listing
    const services = [
      {
        title: 'GST Registration',
        slug: 'gst-registration',
        category: 'GOODS AND SERVICES TAX',
        price: '₹2,500.00',
        shortDescription: 'Complete GST registration for startups, proprietorships, partnership firms, and companies with end-to-end portal verification.',
        description: 'Comprehensive GST Registration services tailored for sole proprietorships, partnerships, LLPs, and Private Limited Companies. We handle end-to-end documentation, application drafting, ARN generation, portal verification, and official GST certificate issuance with absolute precision.',
        icon: 'Building2',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        displayOrder: 1,
        published: true,
        ctaText: 'Get GST Assistance',
        benefits: [
          '100% Online & Hassle-free Registration',
          'Expert Guidance on Required HSN/SAC Codes',
          'Prevents Notice Issuances due to Documentation Errors',
          'Fast-Track Certificate Issuance Support',
        ],
        process: [
          { stepNumber: '01', title: 'Consultation', description: 'Understand your business structure and GST applicability.' },
          { stepNumber: '02', title: 'Document Review', description: 'Collect and verify PAN, Aadhaar, address proof, and bank details.' },
          { stepNumber: '03', title: 'Preparation', description: 'Draft and file Part A & Part B of REG-01 application.' },
          { stepNumber: '04', title: 'Submission', description: 'Generate ARN number and verify Aadhaar authentication.' },
          { stepNumber: '05', title: 'Follow-Up', description: 'Monitor portal approval and deliver your official GST Certificate.' },
        ],
        documents: [
          'PAN Card of Proprietor / Partners / Directors',
          'Aadhaar Card of Applicant',
          'Proof of Business Place (Electricity Bill / Rent Agreement)',
          'Cancelled Cheque / Bank Statement',
          'Certificate of Incorporation / Partnership Deed (if applicable)',
        ],
        seo: {
          metaTitle: 'GST Registration Services ₹2,500 | Vihaan Tax Solutions',
          metaDescription: 'Fast & compliant GST registration at ₹2,500 for businesses and sole proprietors by expert tax consultant Mr. Vilas Joshi.',
          keywords: ['GST Registration', 'GST Portal', 'GST Certificate', 'Tax Consultant Vadodara'],
        },
      },
      {
        title: 'Income Tax Return Filing',
        slug: 'income-tax-return-filing',
        category: 'INCOME TAX',
        price: '₹1,000.00',
        shortDescription: 'Accurate and timely Income Tax Return (ITR) filing for individuals, salaried employees, and business owners.',
        description: 'Optimize your tax liability and claim all eligible deductions under Old and New Tax Regimes. We handle ITR-1, ITR-2, ITR-3, and ITR-4 filings for salaried individuals, freelancers, traders, capital gains investors, and business entities.',
        icon: 'Calculator',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        displayOrder: 2,
        published: true,
        ctaText: 'File Your ITR',
        benefits: [
          'Comprehensive Dual-Regime Tax Computation',
          'Analysis of AIS (Annual Information Statement) & TIS',
          'Fast Refund Processing via E-Verification',
          'Deductions Optimization (80C, 80D, 80G, HRA, NPS)',
        ],
        process: [
          { stepNumber: '01', title: 'Document Collection', description: 'Submit Form 16, Form 26AS, interest certificates, and investments.' },
          { stepNumber: '02', title: 'Tax Computation', description: 'Calculate gross income, capital gains, and evaluate optimal regime.' },
          { stepNumber: '03', title: 'Draft Verification', description: 'Review computation draft with Mr. Vilas Joshi before filing.' },
          { stepNumber: '04', title: 'E-Filing', description: 'Upload return on Income Tax portal securely.' },
          { stepNumber: '05', title: 'E-Verification', description: 'Assist with Aadhaar OTP e-verification for instant refund processing.' },
        ],
        documents: [
          'Form 16 / Salary Certificates',
          'Form 26AS & AIS / TIS Summary',
          'Bank Statements & Interest Certificates',
          'Investment Proofs (80C, Insurance, Mutual Funds)',
        ],
        seo: {
          metaTitle: 'Income Tax Return Filing ₹1,000 | Vihaan Tax Solutions',
          metaDescription: 'Professional ITR filing starting at ₹1,000. Maximize tax refunds with Mr. Vilas Joshi.',
          keywords: ['ITR Filing', 'Income Tax Return', 'Form 16', 'Tax Refund Vadodara'],
        },
      },
      {
        title: 'Accounting',
        slug: 'accounting',
        category: 'ACCOUNTING',
        price: '₹1,500.00',
        shortDescription: 'Comprehensive bookkeeping, ledger maintenance, bank reconciliation, and financial statement preparation.',
        description: 'Maintain clean, audited, and compliant financial books for your enterprise. From daily ledger entries and bank reconciliations to profit & loss statements and balance sheets, our specialized accounting advisory keeps your financial health transparent.',
        icon: 'BookOpenCheck',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        displayOrder: 3,
        published: true,
        ctaText: 'Get Accounting Support',
        benefits: [
          'Monthly Bookkeeping & Ledger Maintenance',
          'Organized Cash Flow & Bank Reconciliation',
          'Tax-Ready Books of Accounts for Annual Audit',
          'Tally & Software Accounting Setup',
        ],
        process: [
          { stepNumber: '01', title: 'Assessment', description: 'Understand transaction volume and bookkeeping frequency.' },
          { stepNumber: '02', title: 'Voucher Entry', description: 'Record daily income, expenditure, and bank transactions.' },
          { stepNumber: '03', title: 'Reconciliation', description: 'Reconcile bank accounts, debtors, and creditors list.' },
          { stepNumber: '04', title: 'Financial Reporting', description: 'Prepare Trial Balance, P&L, and Balance Sheet.' },
        ],
        documents: ['Bank Statements', 'Sales Invoices & Purchase Bills', 'Expense Receipts'],
        seo: {
          metaTitle: 'Accounting & Bookkeeping Services ₹1,500 | Vihaan Tax',
          metaDescription: 'Professional monthly bookkeeping & financial reporting starting at ₹1,500.',
          keywords: ['Accounting Services', 'Bookkeeping Vadodara', 'Balance Sheet'],
        },
      },
      {
        title: 'Company Registration',
        slug: 'company-registration',
        category: 'COMPANY REGISTRATION',
        price: '₹15,000.00',
        shortDescription: 'Complete Private Limited / One Person Company (OPC) incorporation including name approval, DSC, DIN, MOA & AOA.',
        description: 'Turn your business vision into a registered corporate entity. We provide end-to-end Private Limited Company registration, DSC issuance, DIN allocation, MOA & AOA drafting, PAN, TAN, and MCA incorporation approval.',
        icon: 'Briefcase',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        displayOrder: 4,
        published: true,
        ctaText: 'Register Company',
        benefits: [
          'End-to-End MCA SPICe+ Filing',
          'Name Reservation & Approval Fast-Tracking',
          'Drafting of Custom MOA & AOA',
          'PAN, TAN & Corporate Bank Account Opening Kit',
        ],
        process: [
          { stepNumber: '01', title: 'Name Approval', description: 'File RUN / SPICe+ Part A for company name reservation.' },
          { stepNumber: '02', title: 'DSC & DIN', description: 'Obtain Digital Signature Certificates for directors.' },
          { stepNumber: '03', title: 'SPICe+ Incorporation', description: 'Submit incorporation documents to Ministry of Corporate Affairs.' },
          { stepNumber: '04', title: 'Certificate Issuance', description: 'Receive Certificate of Incorporation along with PAN & TAN.' },
        ],
        documents: [
          'PAN & Aadhaar of Directors',
          'Address Proofs of Directors (Bank Statement / Passport)',
          'Registered Office Address Proof (Utility Bill + NOC)',
        ],
        seo: {
          metaTitle: 'Private Limited Company Registration ₹15,000 | Vihaan Tax',
          metaDescription: 'Pvt Ltd & OPC Incorporation services at ₹15,000 by Mr. Vilas Joshi.',
          keywords: ['Company Registration', 'Pvt Ltd Registration', 'MCA Incorporation'],
        },
      },
      {
        title: 'Partnership Firm Registration',
        slug: 'partnership-firm-registration',
        category: 'PARTNERSHIP FIRM REGISTRATION',
        price: '₹2,500.00',
        shortDescription: 'Drafting of legal Partnership Deed, notary notarization, and registration of partnership business.',
        description: 'Establish a legally compliant Partnership Firm. We draft customized Partnership Deeds tailored to your profit-sharing ratio, business objects, and partner rights, followed by notarization and business PAN allocation.',
        icon: 'Users',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        displayOrder: 5,
        published: true,
        ctaText: 'Register Partnership Firm',
        benefits: [
          'Custom Legal Partnership Deed Drafting',
          'Notarization & Stamp Duty Verification',
          'Firm PAN & TAN Allotment Guidance',
          'Current Bank Account Opening Documentation',
        ],
        process: [
          { stepNumber: '01', title: 'Deed Drafting', description: 'Draft partnership agreement terms and partner roles.' },
          { stepNumber: '02', title: 'Notarization', description: 'Execute deed on non-judicial stamp paper with notary seal.' },
          { stepNumber: '03', title: 'PAN Allotment', description: 'File application for Firm PAN card.' },
        ],
        documents: ['PAN & Aadhaar of all Partners', 'Business Premises Address Proof', 'NOC from Property Owner'],
        seo: {
          metaTitle: 'Partnership Firm Registration ₹2,500 | Vihaan Tax',
          metaDescription: 'Professional partnership deed drafting and registration at ₹2,500.',
          keywords: ['Partnership Firm Registration', 'Partnership Deed'],
        },
      },
      {
        title: 'ROF Registration',
        slug: 'rof-registration',
        category: 'PARTNERSHIP FIRM REGISTRATION',
        price: '₹5,000.00',
        shortDescription: 'Registrar of Firms (ROF) official registration for partnership firms for legal standing and court enforceability.',
        description: 'Get your partnership firm officially registered under the Registrar of Firms (ROF) to gain statutory recognition, legal right to enforce contractual claims in court, and enhance creditworthiness with financial institutions.',
        icon: 'ShieldCheck',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        displayOrder: 6,
        published: true,
        ctaText: 'Register with ROF',
        benefits: [
          'Official Certificate from Registrar of Firms',
          'Legal Right to Sue Third Parties in Contractual Disputes',
          'Enhanced Bank Loan Approval Eligibility',
        ],
        process: [
          { stepNumber: '01', title: 'Form A Preparation', description: 'Prepare Form A application with partnership deed.' },
          { stepNumber: '02', title: 'ROF Submission', description: 'Submit physical and portal application to Registrar.' },
          { stepNumber: '03', title: 'Certificate', description: 'Obtain official ROF Registration Certificate.' },
        ],
        documents: ['Registered Partnership Deed', 'Form A signed by all partners', 'Address Proof of Firm'],
        seo: {
          metaTitle: 'Registrar of Firms (ROF) Registration ₹5,000 | Vihaan Tax',
          metaDescription: 'Official ROF Registration for partnership firms at ₹5,000 by Mr. Vilas Joshi.',
          keywords: ['ROF Registration', 'Registrar of Firms', 'Firm Registration Gujarat'],
        },
      },
      {
        title: 'MSME Registration',
        slug: 'msme-registration',
        category: 'MSME',
        price: '₹1,000.00',
        shortDescription: 'Udyam / MSME Registration certificate issuance for micro, small, and medium business benefits and subsidies.',
        description: 'Obtain official Udyam Registration (MSME) to unlock government subsidies, priority bank lending, lower interest rates, collateral-free loans, and protection against delayed payments under MSMED Act.',
        icon: 'Award',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        displayOrder: 7,
        published: true,
        ctaText: 'Get MSME Registration',
        benefits: [
          'Udyam Registration Certificate',
          'Collateral-Free Bank Loan Eligibility',
          'Protection against Delayed Customer Payments',
          'Concessions on Electricity Bills & Trademark Fees',
        ],
        process: [
          { stepNumber: '01', title: 'Aadhaar Verification', description: 'Verify proprietor / director Aadhaar details.' },
          { stepNumber: '02', title: 'Udyam Filing', description: 'Input NIC business activity code and turnover figures.' },
          { stepNumber: '03', title: 'Certificate Delivery', description: 'Deliver official Udyam Registration Certificate.' },
        ],
        documents: ['Aadhaar Card of Applicant', 'PAN Card of Business', 'Bank Account Number & IFSC Code'],
        seo: {
          metaTitle: 'Udyam / MSME Registration ₹1,000 | Vihaan Tax Solutions',
          metaDescription: 'Fast Udyam MSME Registration starting at ₹1,000. Access government subsidies & collateral-free loans.',
          keywords: ['MSME Registration', 'Udyam Registration', 'Small Business Subsidy'],
        },
      },
      {
        title: 'TDS & TCS Compliance',
        slug: 'tds-tcs-compliance',
        category: 'TDS & TCS',
        price: '₹2,500.00',
        shortDescription: 'Quarterly TDS & TCS return filing (Form 24Q, 26Q, 27Q), TAN registration, and Form 16/16A generation.',
        description: 'Ensure accurate tax deduction at source (TDS) and collection at source (TCS). We assist with TAN registration, monthly tax deposit calculation, Form 24Q/26Q quarterly returns, TRACES verification, and Form 16/16A issuance.',
        icon: 'ReceiptCheck',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        displayOrder: 8,
        published: true,
        ctaText: 'Get TDS Compliance Support',
        benefits: [
          'Quarterly Form 24Q & 26Q Return Filings',
          'TRACES Portal Reconciliation & Error Correction',
          'Form 16 & Form 16A Certificate Generation',
          'Prevents Notice & Interest under Section 201',
        ],
        process: [
          { stepNumber: '01', title: 'Challan Review', description: 'Verify monthly TDS deposit challans.' },
          { stepNumber: '02', title: 'Data Preparation', description: 'Prepare deductor & deductee FVU text files.' },
          { stepNumber: '03', title: 'Return Upload', description: 'Upload quarterly return on NSDL / Income Tax portal.' },
        ],
        documents: ['TAN Number', 'TDS Payment Challans', 'Deductee PAN & Amount Details'],
        seo: {
          metaTitle: 'TDS & TCS Compliance & Return Filing ₹2,500 | Vihaan Tax',
          metaDescription: 'Quarterly TDS & TCS return filing services starting at ₹2,500.',
          keywords: ['TDS Return Filing', 'Form 26Q', 'Form 16A', 'TAN Registration'],
        },
      },
      {
        title: 'Trademark Registration',
        slug: 'trademark-registration',
        category: 'TRADEMARK REGISTRATION',
        price: '₹2,500.00',
        shortDescription: 'Brand name, logo, and trademark search, class selection, and filing with IP India registry.',
        description: 'Protect your brand name, logo, and tagline from infringement. We conduct comprehensive trademark search across all 45 classes, draft TM-A applications, and handle IP India registry filings.',
        icon: 'ShieldCheck',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        displayOrder: 9,
        published: true,
        ctaText: 'Register Trademark',
        benefits: [
          'Exclusive Legal Right to Brand Name & Logo',
          'Trademark Class Selection (Goods & Services)',
          'TM Symbol Usage Immediately After Filing',
          'Protection Against Competitor Brand Copying',
        ],
        process: [
          { stepNumber: '01', title: 'Search', description: 'Conduct public search on IP India registry.' },
          { stepNumber: '02', title: 'Application Drafting', description: 'Draft TM-A application with user affidavit.' },
          { stepNumber: '03', title: 'Filing', description: 'Submit application and obtain TM application number.' },
        ],
        documents: ['Logo / Brand Name Specimen', 'Identity Proof of Applicant', 'MSME Certificate (for 50% govt fee concession)'],
        seo: {
          metaTitle: 'Brand & Trademark Registration ₹2,500 | Vihaan Tax',
          metaDescription: 'Protect your brand name & logo with expert trademark filing at ₹2,500.',
          keywords: ['Trademark Registration', 'Brand Protection', 'TM Filing Vadodara'],
        },
      },
      {
        title: 'Audit & Assurance',
        slug: 'audit-assurance',
        category: 'AUDIT',
        price: 'Contact for Quote',
        shortDescription: 'Statutory tax audit under Section 44AB, internal financial controls review, and assurance reporting.',
        description: 'Independent, rigorous audit and assurance services designed to verify internal financial controls, detect discrepancies, maintain statutory Tax Audit (Form 3CA/3CB-3CD) compliance, and strengthen bank and stakeholder confidence.',
        icon: 'ShieldCheck',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        displayOrder: 10,
        published: true,
        ctaText: 'Discuss Audit Requirements',
        benefits: [
          'Statutory Tax Audit under Section 44AB',
          'Form 3CA/3CB & 3CD Audit Report Certification',
          'Financial Risk Mitigation & Control Review',
          'Enhanced Credibility for Banks & Financial Lenders',
        ],
        process: [
          { stepNumber: '01', title: 'Audit Planning', description: 'Define audit scope, ledger checks, and parameters.' },
          { stepNumber: '02', title: 'Verification', description: 'Examine ledger postings, bank registers, and statutory filings.' },
          { stepNumber: '03', title: 'Audit Report', description: 'Issue formal signed Tax Audit report.' },
        ],
        documents: ['Books of Accounts', 'Trial Balance & Financial Statements', 'GST & Income Tax Filings'],
        seo: {
          metaTitle: 'Audit & Tax Assurance Services | Vihaan Tax Solutions',
          metaDescription: 'Independent Tax Audit & Assurance services by Mr. Vilas Joshi.',
          keywords: ['Tax Audit', 'Section 44AB', 'Statutory Audit Vadodara'],
        },
      },
    ];

    await Service.insertMany(services);
    console.log('[Seed] 10 Real Products & Services created.');

    // 3. Create Settings with exact Vadodara address & phone
    await Setting.create({
      companyName: 'Vihaan Tax Solutions',
      tagline: 'Trusted, Confidential and Professional Tax & Accounting Advisory',
      phone: '+91 78610 96198',
      email: 'Info.vihaantax@gmail.com',
      whatsapp: '917861096198',
      address: 'D 402 Altus 99 b/s Somnath Heritage Gotri Sevasi Road, 12 mtr, Canal Rd, Vadodara, Gujarat 391101',
      mapEmbedUrl: 'https://maps.google.com/maps?q=D+402+Altus+99+Gotri+Sevasi+Road+Vadodara+Gujarat+391101&t=&z=14&ie=UTF8&iwloc=&output=embed',
      officeHours: 'Monday - Saturday: 9:30 AM - 7:00 PM',
      consultant: {
        name: 'Mr. Vilas Joshi',
        designation: 'Tax Consultant',
        bio: 'With over a decade of hands-on consultancy experience in Vadodara, Mr. Vilas Joshi has empowered business owners, startups, and individual taxpayers with strategic tax planning, statutory GST compliance, meticulous accounting, and proactive financial oversight.',
        philosophy: 'Trusted. Confidential. Professional. Every financial decision deserves clarity, strategic depth, and total regulatory adherence.',
        experienceYears: '10+',
        image: '/images/vilas_joshi.png',
      },
      hero: {
        eyebrow: 'TAX • GST • ACCOUNTING • BUSINESS ADVISORY',
        heading: 'Clarity in Numbers. Confidence in Every Decision.',
        description: 'Professional tax, GST, accounting, and business advisory services in Vadodara designed to help individuals and businesses stay compliant, reduce tax burdens, and make better financial decisions.',
        ctaPrimary: 'Book a Consultation',
        ctaSecondary: 'Explore Services',
        heroImage: '/images/hero.png',
      },
      trustStats: [
        { number: '10+', label: 'Years Experience', visible: true },
        { number: '500+', label: 'Clients Assisted', visible: true },
        { number: '10+', label: 'Core Services', visible: true },
        { number: '100%', label: 'Confidentiality Focused', visible: true },
      ],
      socialLinks: {
        whatsapp: 'https://wa.me/917861096198',
        linkedin: '',
        instagram: '',
        facebook: '',
      },
      globalSeo: {
        metaTitle: 'Vihaan Tax Solutions | CA & Tax Consultancy Vadodara',
        metaDescription: 'Expert GST Registration (₹2,500), ITR Filing (₹1,000), Accounting (₹1,500), Company Registration (₹15,000) by Mr. Vilas Joshi.',
        keywords: ['Tax Consultant Vadodara', 'GST Registration Vadodara', 'ITR Filing Vadodara', 'Accounting Services'],
        ogImage: '/images/hero.png',
      },
    });
    console.log('[Seed] Real Vadodara address & global settings initialized.');

    // 4. Create FAQs
    const faqs = [
      {
        question: 'What is the fee for GST Registration at Vihaan Tax Solutions?',
        answer: 'Our professional fee for complete GST Registration is ₹2,500.00. This includes end-to-end documentation guidance, REG-01 portal filing, Aadhaar authentication support, and official GST Certificate delivery.',
        category: 'GST',
        displayOrder: 1,
        published: true,
      },
      {
        question: 'What is the fee for Income Tax Return (ITR) Filing?',
        answer: 'Income Tax Return filing services start at ₹1,000.00. We analyze Form 16, Form 26AS, AIS/TIS data, evaluate Old vs New tax regimes, and assist with e-verification for fast refund processing.',
        category: 'ITR',
        displayOrder: 2,
        published: true,
      },
      {
        question: 'How much does Private Limited Company Registration cost?',
        answer: 'Complete Private Limited Company / OPC Incorporation starts at ₹15,000.00. This covers name reservation, Digital Signature Certificates (DSC), DIN allocation, MOA & AOA drafting, PAN, TAN, and MCA incorporation approval.',
        category: 'Business Registration',
        displayOrder: 3,
        published: true,
      },
      {
        question: 'Where is Vihaan Tax Solutions office located in Vadodara?',
        answer: 'Our office is located at D 402 Altus 99, b/s Somnath Heritage, Gotri Sevasi Road, 12 mtr Canal Rd, Vadodara, Gujarat 391101.',
        category: 'General',
        displayOrder: 4,
        published: true,
      },
      {
        question: 'How is confidential business data protected at Vihaan Tax Solutions?',
        answer: 'Confidentiality is our founding core value. Client financial data, tax returns, and records are maintained with strict access controls and nondisclosure commitments.',
        category: 'General',
        displayOrder: 5,
        published: true,
      },
    ];

    await FAQ.insertMany(faqs);
    console.log('[Seed] FAQs created.');

    // 5. Create Testimonials
    const testimonials = [
      {
        name: 'Rajesh Patel',
        designation: 'Managing Director',
        company: 'Patel Logistics Solutions',
        rating: 5,
        content: 'Mr. Vilas Joshi and Vihaan Tax Solutions have managed our GST filings and accounting flawlessly for over 3 years. Their prompt advice saved us from unnecessary penalties and improved our ITC claims.',
        published: true,
        displayOrder: 1,
      },
      {
        name: 'Ananya Sharma',
        designation: 'Founder & CEO',
        company: 'Apex Tech Innovations',
        rating: 5,
        content: 'Registering our firm and setting up our accounting compliance was surprisingly smooth. Vihaan Tax Solutions guided us through every document required with absolute transparency.',
        published: true,
        displayOrder: 2,
      },
      {
        name: 'Deepak Mehta',
        designation: 'Consultant',
        company: 'Individual Taxpayer',
        rating: 5,
        content: 'Filing my Income Tax Return with capital gains was stress-free. Mr. Vilas Joshi reviewed my AIS statement line by line and ensured maximum eligible deductions under the law.',
        published: true,
        displayOrder: 3,
      },
    ];

    await Testimonial.insertMany(testimonials);
    console.log('[Seed] Testimonials created.');

    // 6. Create Initial Sample Leads
    const leads = [
      {
        leadNumber: 'VTS-1001',
        name: 'Suresh Verma',
        phone: '9876543210',
        email: 'suresh.verma@example.com',
        serviceName: 'GST Registration',
        customerType: 'Business',
        message: 'Looking to register my new retail trading business under GST.',
        preferredContactMethod: 'Call',
        preferredContactTime: 'Morning',
        status: 'New',
        notes: [{ author: 'System', note: 'Sample initial enquiry', createdAt: new Date() }],
        source: 'Website Form',
      },
      {
        leadNumber: 'VTS-1002',
        name: 'Pooja Kulkarni',
        phone: '9822011223',
        email: 'pooja.k@example.com',
        serviceName: 'Income Tax Return Filing',
        customerType: 'Individual',
        message: 'Need help filing ITR-2 for salary plus stock market capital gains.',
        preferredContactMethod: 'WhatsApp',
        preferredContactTime: 'Afternoon',
        status: 'In Discussion',
        notes: [{ author: 'Mr. Vilas Joshi', note: 'Sent requested documents checklist over WhatsApp.', createdAt: new Date() }],
        source: 'Website Form',
      },
    ];

    await Lead.insertMany(leads);
    console.log('[Seed] Sample leads inserted.');

    console.log('\n======================================================');
    console.log('✅ REAL GOOGLE BUSINESS PRODUCTS & ADDRESS SEEDED!');
    console.log('Office: Vadodara, Gujarat 391101');
    console.log('Phone: +91 78610 96198');
    console.log('Admin Email: admin@vihaantax.com');
    console.log('Admin Password: Admin@123456');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
