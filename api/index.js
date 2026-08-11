"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/src/app.ts
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_express9 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_helmet = __toESM(require("helmet"));
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var import_path2 = __toESM(require("path"));
var import_dotenv2 = __toESM(require("dotenv"));

// server/src/routes/authRoutes.ts
var import_express = require("express");

// server/src/controllers/authController.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_bcryptjs2 = __toESM(require("bcryptjs"));

// server/src/models/User.ts
var import_mongoose = __toESM(require("mongoose"));
var import_bcryptjs = __toESM(require("bcryptjs"));
var userSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["SUPER_ADMIN", "ADMIN", "EDITOR"], default: "ADMIN" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    lastLogin: { type: Date }
  },
  { timestamps: true }
);
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await import_bcryptjs.default.compare(candidatePassword, this.passwordHash);
};
var User = import_mongoose.default.model("User", userSchema);

// server/src/utils/AppError.ts
var AppError = class extends Error {
  statusCode;
  status;
  isOperational;
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};

// server/src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// server/src/controllers/authController.ts
var signToken = (id) => {
  const secret = process.env.JWT_SECRET || "vihaan_tax_solutions_super_secret_jwt_key_2026";
  return import_jsonwebtoken.default.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};
var login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !await user.correctPassword(password)) {
    return next(new AppError("Incorrect email or password", 401));
  }
  if (user.status !== "ACTIVE") {
    return next(new AppError("Account is inactive. Please contact administration.", 403));
  }
  user.lastLogin = /* @__PURE__ */ new Date();
  await user.save({ validateBeforeSave: false });
  const token = signToken(user._id.toString());
  user.passwordHash = void 0;
  res.status(200).json({
    status: "success",
    token,
    data: {
      user
    }
  });
});
var getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user
    }
  });
});
var changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new AppError("Please provide current and new password", 400));
  }
  const user = await User.findById(req.user?._id).select("+passwordHash");
  if (!user || !await user.correctPassword(currentPassword)) {
    return next(new AppError("Your current password is wrong", 401));
  }
  user.passwordHash = await import_bcryptjs2.default.hash(newPassword, 12);
  await user.save();
  const token = signToken(user._id.toString());
  res.status(200).json({
    status: "success",
    token,
    message: "Password updated successfully"
  });
});

// server/src/middleware/authMiddleware.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in. Please log in to get access.", 401));
  }
  const secret = process.env.JWT_SECRET || "vihaan_tax_solutions_super_secret_jwt_key_2026";
  const decoded = import_jsonwebtoken2.default.verify(token, secret);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }
  if (currentUser.status !== "ACTIVE") {
    return next(new AppError("Your account has been deactivated.", 403));
  }
  req.user = currentUser;
  next();
});
var restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  };
};

// server/src/routes/authRoutes.ts
var router = (0, import_express.Router)();
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);
var authRoutes_default = router;

// server/src/routes/serviceRoutes.ts
var import_express2 = require("express");

// server/src/models/Service.ts
var import_mongoose2 = __toESM(require("mongoose"));
var serviceSchema = new import_mongoose2.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, default: "General" },
    price: { type: String, default: "" },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "FileText" },
    heroImage: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    benefits: [{ type: String }],
    process: [
      {
        stepNumber: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true }
      }
    ],
    documents: [{ type: String }],
    ctaText: { type: String, default: "Book Consultation" },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }]
    }
  },
  { timestamps: true }
);
var Service = import_mongoose2.default.model("Service", serviceSchema);

// server/src/utils/defaultData.ts
var DEFAULT_SERVICES = [
  {
    _id: "default-1",
    title: "GST Registration",
    slug: "gst-registration",
    category: "GOODS AND SERVICES TAX",
    price: "\u20B92,500.00",
    shortDescription: "Complete GST registration for startups, proprietorships, partnership firms, and companies with end-to-end portal verification.",
    description: "Comprehensive GST Registration services tailored for sole proprietorships, partnerships, LLPs, and Private Limited Companies. We handle end-to-end documentation, application drafting, ARN generation, portal verification, and official GST certificate issuance with absolute precision.",
    icon: "Building2",
    heroImage: "/images/hero.png",
    thumbnail: "/images/hero.png",
    displayOrder: 1,
    published: true,
    ctaText: "Get GST Assistance",
    benefits: [
      "100% Online & Hassle-free Registration",
      "Expert Guidance on Required HSN/SAC Codes",
      "Prevents Notice Issuances due to Documentation Errors",
      "Fast-Track Certificate Issuance Support"
    ],
    process: [
      { stepNumber: "01", title: "Consultation", description: "Understand your business structure and GST applicability." },
      { stepNumber: "02", title: "Document Review", description: "Collect and verify PAN, Aadhaar, address proof, and bank details." },
      { stepNumber: "03", title: "Preparation", description: "Draft and file Part A & Part B of REG-01 application." },
      { stepNumber: "04", title: "Submission", description: "Generate ARN number and verify Aadhaar authentication." },
      { stepNumber: "05", title: "Follow-Up", description: "Monitor portal approval and deliver your official GST Certificate." }
    ],
    documents: [
      "PAN Card of Proprietor / Partners / Directors",
      "Aadhaar Card of Applicant",
      "Proof of Business Place (Electricity Bill / Rent Agreement)",
      "Cancelled Cheque / Bank Statement",
      "Certificate of Incorporation / Partnership Deed (if applicable)"
    ],
    seo: {
      metaTitle: "GST Registration Services \u20B92,500 | Vihaan Tax Solutions",
      metaDescription: "Fast & compliant GST registration at \u20B92,500 for businesses and sole proprietors by expert tax consultant Mr. Vilas Joshi.",
      keywords: ["GST Registration", "GST Portal", "GST Certificate", "Tax Consultant Vadodara"]
    }
  },
  {
    _id: "default-2",
    title: "Income Tax Return Filing",
    slug: "income-tax-return-filing",
    category: "INCOME TAX",
    price: "\u20B91,000.00",
    shortDescription: "Accurate and timely Income Tax Return (ITR) filing for individuals, salaried employees, and business owners.",
    description: "Optimize your tax liability and claim all eligible deductions under Old and New Tax Regimes. We handle ITR-1, ITR-2, ITR-3, and ITR-4 filings for salaried individuals, freelancers, traders, capital gains investors, and business entities.",
    icon: "Calculator",
    heroImage: "/images/hero.png",
    thumbnail: "/images/hero.png",
    displayOrder: 2,
    published: true,
    ctaText: "File Your ITR",
    benefits: [
      "Comprehensive Dual-Regime Tax Computation",
      "Analysis of AIS (Annual Information Statement) & TIS",
      "Fast Refund Processing via E-Verification",
      "Deductions Optimization (80C, 80D, 80G, HRA, NPS)"
    ],
    process: [
      { stepNumber: "01", title: "Document Collection", description: "Submit Form 16, Form 26AS, interest certificates, and investments." },
      { stepNumber: "02", title: "Tax Computation", description: "Calculate gross income, capital gains, and evaluate optimal regime." },
      { stepNumber: "03", title: "Draft Verification", description: "Review computation draft with Mr. Vilas Joshi before filing." },
      { stepNumber: "04", title: "E-Filing", description: "Upload return on Income Tax portal securely." },
      { stepNumber: "05", title: "E-Verification", description: "Assist with Aadhaar OTP e-verification for instant refund processing." }
    ],
    documents: [
      "Form 16 / Salary Certificates",
      "Form 26AS & AIS / TIS Summary",
      "Bank Statements & Interest Certificates",
      "Investment Proofs (80C, Insurance, Mutual Funds)"
    ],
    seo: {
      metaTitle: "Income Tax Return Filing \u20B91,000 | Vihaan Tax Solutions",
      metaDescription: "Professional ITR filing starting at \u20B91,000. Maximize tax refunds with Mr. Vilas Joshi.",
      keywords: ["ITR Filing", "Income Tax Return", "Form 16", "Tax Refund Vadodara"]
    }
  },
  {
    _id: "default-3",
    title: "Accounting",
    slug: "accounting",
    category: "ACCOUNTING",
    price: "\u20B91,500.00",
    shortDescription: "Comprehensive bookkeeping, ledger maintenance, bank reconciliation, and financial statement preparation.",
    description: "Maintain clean, audited, and compliant financial books for your enterprise. From daily ledger entries and bank reconciliations to profit & loss statements and balance sheets, our specialized accounting advisory keeps your financial health transparent.",
    icon: "BookOpenCheck",
    heroImage: "/images/hero.png",
    thumbnail: "/images/hero.png",
    displayOrder: 3,
    published: true,
    ctaText: "Get Accounting Support",
    benefits: [
      "Monthly Bookkeeping & Ledger Maintenance",
      "Organized Cash Flow & Bank Reconciliation",
      "Tax-Ready Books of Accounts for Annual Audit",
      "Tally & Software Accounting Setup"
    ],
    process: [
      { stepNumber: "01", title: "Assessment", description: "Understand transaction volume and bookkeeping frequency." },
      { stepNumber: "02", title: "Voucher Entry", description: "Record daily income, expenditure, and bank transactions." },
      { stepNumber: "03", title: "Reconciliation", description: "Reconcile bank accounts, debtors, and creditors list." },
      { stepNumber: "04", title: "Financial Reporting", description: "Prepare Trial Balance, P&L, and Balance Sheet." }
    ],
    documents: ["Bank Statements", "Sales Invoices & Purchase Bills", "Expense Receipts"],
    seo: {
      metaTitle: "Accounting & Bookkeeping Services \u20B91,500 | Vihaan Tax",
      metaDescription: "Professional monthly bookkeeping & financial reporting starting at \u20B91,500.",
      keywords: ["Accounting Services", "Bookkeeping Vadodara", "Balance Sheet"]
    }
  },
  {
    _id: "default-4",
    title: "Company Registration",
    slug: "company-registration",
    category: "COMPANY REGISTRATION",
    price: "\u20B915,000.00",
    shortDescription: "Complete Private Limited / One Person Company (OPC) incorporation including name approval, DSC, DIN, MOA & AOA.",
    description: "Turn your business vision into a registered corporate entity. We provide end-to-end Private Limited Company registration, DSC issuance, DIN allocation, MOA & AOA drafting, PAN, TAN, and MCA incorporation approval.",
    icon: "Briefcase",
    heroImage: "/images/hero.png",
    thumbnail: "/images/hero.png",
    displayOrder: 4,
    published: true,
    ctaText: "Register Company",
    benefits: [
      "End-to-End MCA SPICe+ Filing",
      "Name Reservation & Approval Fast-Tracking",
      "Drafting of Custom MOA & AOA",
      "PAN, TAN & Corporate Bank Account Opening Kit"
    ],
    process: [
      { stepNumber: "01", title: "Name Approval", description: "File RUN / SPICe+ Part A for company name reservation." },
      { stepNumber: "02", title: "DSC & DIN", description: "Obtain Digital Signature Certificates for directors." },
      { stepNumber: "03", title: "SPICe+ Incorporation", description: "Submit incorporation documents to Ministry of Corporate Affairs." },
      { stepNumber: "04", title: "Certificate Issuance", description: "Receive Certificate of Incorporation along with PAN & TAN." }
    ],
    documents: [
      "PAN & Aadhaar of Directors",
      "Address Proofs of Directors (Bank Statement / Passport)",
      "Registered Office Address Proof (Utility Bill + NOC)"
    ],
    seo: {
      metaTitle: "Private Limited Company Registration \u20B915,000 | Vihaan Tax",
      metaDescription: "Pvt Ltd & OPC Incorporation services at \u20B915,000 by Mr. Vilas Joshi.",
      keywords: ["Company Registration", "Pvt Ltd Registration", "MCA Incorporation"]
    }
  },
  {
    _id: "default-5",
    title: "Partnership Firm Registration",
    slug: "partnership-firm-registration",
    category: "PARTNERSHIP FIRM REGISTRATION",
    price: "\u20B92,500.00",
    shortDescription: "Drafting of legal Partnership Deed, notary notarization, and registration of partnership business.",
    description: "Establish a legally compliant Partnership Firm. We draft customized Partnership Deeds tailored to your profit-sharing ratio, business objects, and partner rights, followed by notarization and business PAN allocation.",
    icon: "Users",
    heroImage: "/images/hero.png",
    thumbnail: "/images/hero.png",
    displayOrder: 5,
    published: true,
    ctaText: "Register Partnership Firm",
    benefits: [
      "Custom Legal Partnership Deed Drafting",
      "Notarization & Stamp Duty Verification",
      "Firm PAN & TAN Allotment Guidance",
      "Current Bank Account Opening Documentation"
    ],
    process: [
      { stepNumber: "01", title: "Deed Drafting", description: "Draft partnership agreement terms and partner roles." },
      { stepNumber: "02", title: "Notarization", description: "Execute deed on non-judicial stamp paper with notary seal." },
      { stepNumber: "03", title: "PAN Allotment", description: "File application for Firm PAN card." }
    ],
    documents: ["PAN & Aadhaar of all Partners", "Business Premises Address Proof", "NOC from Property Owner"],
    seo: {
      metaTitle: "Partnership Firm Registration \u20B92,500 | Vihaan Tax",
      metaDescription: "Professional partnership deed drafting and registration at \u20B92,500.",
      keywords: ["Partnership Firm Registration", "Partnership Deed"]
    }
  },
  {
    _id: "default-6",
    title: "ROF Registration",
    slug: "rof-registration",
    category: "PARTNERSHIP FIRM REGISTRATION",
    price: "\u20B95,000.00",
    shortDescription: "Registrar of Firms (ROF) official registration for partnership firms for legal standing and court enforceability.",
    description: "Get your partnership firm officially registered under the Registrar of Firms (ROF) to gain statutory recognition, legal right to enforce contractual claims in court, and enhance creditworthiness with financial institutions.",
    icon: "ShieldCheck",
    heroImage: "/images/hero.png",
    thumbnail: "/images/hero.png",
    displayOrder: 6,
    published: true,
    ctaText: "Register with ROF",
    benefits: [
      "Official Certificate from Registrar of Firms",
      "Legal Right to Sue Third Parties in Contractual Disputes",
      "Enhanced Bank Loan Approval Eligibility"
    ],
    process: [
      { stepNumber: "01", title: "Form A Preparation", description: "Prepare Form A application with partnership deed." },
      { stepNumber: "02", title: "ROF Submission", description: "Submit physical and portal application to Registrar." },
      { stepNumber: "03", title: "Certificate", description: "Obtain official ROF Registration Certificate." }
    ],
    documents: ["Registered Partnership Deed", "Form A signed by all partners", "Address Proof of Firm"],
    seo: {
      metaTitle: "Registrar of Firms (ROF) Registration \u20B95,000 | Vihaan Tax",
      metaDescription: "Official ROF Registration for partnership firms at \u20B95,000 by Mr. Vilas Joshi.",
      keywords: ["ROF Registration", "Registrar of Firms", "Firm Registration Gujarat"]
    }
  },
  {
    _id: "default-7",
    title: "MSME Registration",
    slug: "msme-registration",
    category: "MSME",
    price: "\u20B91,000.00",
    shortDescription: "Udyam / MSME Registration certificate issuance for micro, small, and medium business benefits and subsidies.",
    description: "Obtain official Udyam Registration (MSME) to unlock government subsidies, priority bank lending, lower interest rates, collateral-free loans, and protection against delayed payments under MSMED Act.",
    icon: "Award",
    heroImage: "/images/hero.png",
    thumbnail: "/images/hero.png",
    displayOrder: 7,
    published: true,
    ctaText: "Get MSME Registration",
    benefits: [
      "Udyam Registration Certificate",
      "Collateral-Free Bank Loan Eligibility",
      "Protection against Delayed Customer Payments",
      "Concessions on Electricity Bills & Trademark Fees"
    ],
    process: [
      { stepNumber: "01", title: "Aadhaar Verification", description: "Verify proprietor / director Aadhaar details." },
      { stepNumber: "02", title: "Udyam Filing", description: "Input NIC business activity code and turnover figures." },
      { stepNumber: "03", title: "Certificate Delivery", description: "Deliver official Udyam Registration Certificate." }
    ],
    documents: ["Aadhaar Card of Applicant", "PAN Card of Business", "Bank Account Number & IFSC Code"],
    seo: {
      metaTitle: "Udyam / MSME Registration \u20B91,000 | Vihaan Tax Solutions",
      metaDescription: "Fast Udyam MSME Registration starting at \u20B91,000. Access government subsidies & collateral-free loans.",
      keywords: ["MSME Registration", "Udyam Registration", "Small Business Subsidy"]
    }
  },
  {
    _id: "default-8",
    title: "TDS & TCS Compliance",
    slug: "tds-tcs-compliance",
    category: "TDS & TCS",
    price: "\u20B92,500.00",
    shortDescription: "Quarterly TDS & TCS return filing (Form 24Q, 26Q, 27Q), TAN registration, and Form 16/16A generation.",
    description: "Ensure accurate tax deduction at source (TDS) and collection at source (TCS). We assist with TAN registration, monthly tax deposit calculation, Form 24Q/26Q quarterly returns, TRACES verification, and Form 16/16A issuance.",
    icon: "ReceiptCheck",
    heroImage: "/images/hero.png",
    thumbnail: "/images/hero.png",
    displayOrder: 8,
    published: true,
    ctaText: "Get TDS Compliance Support",
    benefits: [
      "Quarterly Form 24Q & 26Q Return Filings",
      "TRACES Portal Reconciliation & Error Correction",
      "Form 16 & Form 16A Certificate Generation",
      "Prevents Notice & Interest under Section 201"
    ],
    process: [
      { stepNumber: "01", title: "Challan Review", description: "Verify monthly TDS deposit challans." },
      { stepNumber: "02", title: "Data Preparation", description: "Prepare deductor & deductee FVU text files." },
      { stepNumber: "03", title: "Return Upload", description: "Upload quarterly return on NSDL / Income Tax portal." }
    ],
    documents: ["TAN Number", "TDS Payment Challans", "Deductee PAN & Amount Details"],
    seo: {
      metaTitle: "TDS & TCS Compliance & Return Filing \u20B92,500 | Vihaan Tax",
      metaDescription: "Quarterly TDS & TCS return filing services starting at \u20B92,500.",
      keywords: ["TDS Return Filing", "Form 26Q", "Form 16A", "TAN Registration"]
    }
  },
  {
    _id: "default-9",
    title: "Trademark Registration",
    slug: "trademark-registration",
    category: "TRADEMARK REGISTRATION",
    price: "\u20B92,500.00",
    shortDescription: "Brand name, logo, and trademark search, class selection, and filing with IP India registry.",
    description: "Protect your brand name, logo, and tagline from infringement. We conduct comprehensive trademark search across all 45 classes, draft TM-A applications, and handle IP India registry filings.",
    icon: "ShieldCheck",
    heroImage: "/images/hero.png",
    thumbnail: "/images/hero.png",
    displayOrder: 9,
    published: true,
    ctaText: "Register Trademark",
    benefits: [
      "Exclusive Legal Right to Brand Name & Logo",
      "Trademark Class Selection (Goods & Services)",
      "TM Symbol Usage Immediately After Filing",
      "Protection Against Competitor Brand Copying"
    ],
    process: [
      { stepNumber: "01", title: "Search", description: "Conduct public search on IP India registry." },
      { stepNumber: "02", title: "Application Drafting", description: "Draft TM-A application with user affidavit." },
      { stepNumber: "03", title: "Filing", description: "Submit application and obtain TM application number." }
    ],
    documents: ["Logo / Brand Name Specimen", "Identity Proof of Applicant", "MSME Certificate (for 50% govt fee concession)"],
    seo: {
      metaTitle: "Brand & Trademark Registration \u20B92,500 | Vihaan Tax",
      metaDescription: "Protect your brand name & logo with expert trademark filing at \u20B92,500.",
      keywords: ["Trademark Registration", "Brand Protection", "TM Filing Vadodara"]
    }
  },
  {
    _id: "default-10",
    title: "Audit & Assurance",
    slug: "audit-assurance",
    category: "AUDIT",
    price: "Contact for Quote",
    shortDescription: "Statutory tax audit under Section 44AB, internal financial controls review, and assurance reporting.",
    description: "Independent, rigorous audit and assurance services designed to verify internal financial controls, detect discrepancies, maintain statutory Tax Audit (Form 3CA/3CB-3CD) compliance, and strengthen bank and stakeholder confidence.",
    icon: "ShieldCheck",
    heroImage: "/images/hero.png",
    thumbnail: "/images/hero.png",
    displayOrder: 10,
    published: true,
    ctaText: "Discuss Audit Requirements",
    benefits: [
      "Statutory Tax Audit under Section 44AB",
      "Form 3CA/3CB & 3CD Audit Report Certification",
      "Financial Risk Mitigation & Control Review",
      "Enhanced Credibility for Banks & Financial Lenders"
    ],
    process: [
      { stepNumber: "01", title: "Audit Planning", description: "Define audit scope, ledger checks, and parameters." },
      { stepNumber: "02", title: "Verification", description: "Examine ledger postings, bank registers, and statutory filings." },
      { stepNumber: "03", title: "Audit Report", description: "Issue formal signed Tax Audit report." }
    ],
    documents: ["Books of Accounts", "Trial Balance & Financial Statements", "GST & Income Tax Filings"],
    seo: {
      metaTitle: "Audit & Tax Assurance Services | Vihaan Tax Solutions",
      metaDescription: "Independent Tax Audit & Assurance services by Mr. Vilas Joshi.",
      keywords: ["Tax Audit", "Section 44AB", "Statutory Audit Vadodara"]
    }
  }
];
var DEFAULT_SETTINGS = {
  companyName: "Vihaan Tax Solutions",
  tagline: "Trusted, Confidential and Professional Tax & Accounting Advisory",
  phone: "+91 78610 96198",
  email: "Info.vihaantax@gmail.com",
  whatsapp: "917861096198",
  address: "D 402 Altus 99 b/s Somnath Heritage Gotri Sevasi Road, 12 mtr, Canal Rd, Vadodara, Gujarat 391101",
  mapEmbedUrl: "https://maps.google.com/maps?q=D+402+Altus+99+Gotri+Sevasi+Road+Vadodara+Gujarat+391101&t=&z=14&ie=UTF8&iwloc=&output=embed",
  officeHours: "Monday - Saturday: 9:30 AM - 7:00 PM",
  consultant: {
    name: "Mr. Vilas Joshi",
    designation: "Tax Consultant",
    bio: "With 7+ years of hands-on consultancy experience in Vadodara, Mr. Vilas Joshi has empowered business owners, startups, and individual taxpayers with strategic tax planning, statutory GST compliance, meticulous accounting, and proactive financial oversight.",
    philosophy: "Trusted. Confidential. Professional. Every financial decision deserves clarity, strategic depth, and total regulatory adherence.",
    experienceYears: "7+",
    image: "/images/vilas_joshi.png"
  },
  hero: {
    eyebrow: "TAX \u2022 GST \u2022 ACCOUNTING \u2022 BUSINESS ADVISORY",
    heading: "Clarity in Numbers. Confidence in Every Decision.",
    description: "Professional tax, GST, accounting, and business advisory services in Vadodara designed to help individuals and businesses stay compliant, reduce tax burdens, and make better financial decisions.",
    ctaPrimary: "Book a Consultation",
    ctaSecondary: "Explore Services",
    heroImage: "/images/hero.png"
  },
  trustStats: [
    { number: "7+", label: "Years Experience", visible: true },
    { number: "500+", label: "Clients Assisted", visible: true },
    { number: "10+", label: "Core Services", visible: true },
    { number: "100%", label: "Confidentiality Focused", visible: true }
  ],
  socialLinks: {
    whatsapp: "https://wa.me/917861096198",
    linkedin: "",
    instagram: "",
    facebook: ""
  },
  globalSeo: {
    metaTitle: "Vihaan Tax Solutions | CA & Tax Consultancy Vadodara",
    metaDescription: "Expert GST Registration (\u20B92,500), ITR Filing (\u20B91,000), Accounting (\u20B91,500), Company Registration (\u20B915,000) by Mr. Vilas Joshi.",
    keywords: ["Tax Consultant Vadodara", "GST Registration Vadodara", "ITR Filing Vadodara", "Accounting Services"],
    ogImage: "/images/hero.png"
  }
};
var DEFAULT_FAQS = [
  {
    _id: "faq-1",
    question: "What is the fee for GST Registration at Vihaan Tax Solutions?",
    answer: "Our professional fee for complete GST Registration is \u20B92,500.00. This includes end-to-end documentation guidance, REG-01 portal filing, Aadhaar authentication support, and official GST Certificate delivery.",
    category: "GST",
    displayOrder: 1,
    published: true
  },
  {
    _id: "faq-2",
    question: "What is the fee for Income Tax Return (ITR) Filing?",
    answer: "Income Tax Return filing services start at \u20B91,000.00. We analyze Form 16, Form 26AS, AIS/TIS data, evaluate Old vs New tax regimes, and assist with e-verification for fast refund processing.",
    category: "ITR",
    displayOrder: 2,
    published: true
  },
  {
    _id: "faq-3",
    question: "How much does Private Limited Company Registration cost?",
    answer: "Complete Private Limited Company / OPC Incorporation starts at \u20B915,000.00. This covers name reservation, Digital Signature Certificates (DSC), DIN allocation, MOA & AOA drafting, PAN, TAN, and MCA incorporation approval.",
    category: "Business Registration",
    displayOrder: 3,
    published: true
  },
  {
    _id: "faq-4",
    question: "Where is Vihaan Tax Solutions office located in Vadodara?",
    answer: "Our office is located at D 402 Altus 99, b/s Somnath Heritage, Gotri Sevasi Road, 12 mtr Canal Rd, Vadodara, Gujarat 391101.",
    category: "General",
    displayOrder: 4,
    published: true
  },
  {
    _id: "faq-5",
    question: "How is confidential business data protected at Vihaan Tax Solutions?",
    answer: "Confidentiality is our founding core value. Client financial data, tax returns, and records are maintained with strict access controls and nondisclosure commitments.",
    category: "General",
    displayOrder: 5,
    published: true
  }
];
var DEFAULT_TESTIMONIALS = [
  {
    _id: "test-1",
    name: "Rajesh Patel",
    designation: "Managing Director",
    company: "Patel Logistics Solutions",
    rating: 5,
    content: "Mr. Vilas Joshi and Vihaan Tax Solutions have managed our GST filings and accounting flawlessly for over 3 years. Their prompt advice saved us from unnecessary penalties and improved our ITC claims.",
    published: true,
    displayOrder: 1
  },
  {
    _id: "test-2",
    name: "Ananya Sharma",
    designation: "Founder & CEO",
    company: "Apex Tech Innovations",
    rating: 5,
    content: "Registering our firm and setting up our accounting compliance was surprisingly smooth. Vihaan Tax Solutions guided us through every document required with absolute transparency.",
    published: true,
    displayOrder: 2
  },
  {
    _id: "test-3",
    name: "Deepak Mehta",
    designation: "Consultant",
    company: "Individual Taxpayer",
    rating: 5,
    content: "Filing my Income Tax Return with capital gains was stress-free. Mr. Vilas Joshi reviewed my AIS statement line by line and ensured maximum eligible deductions under the law.",
    published: true,
    displayOrder: 3
  }
];

// server/src/controllers/serviceController.ts
var getServices = catchAsync(async (_req, res) => {
  try {
    const services = await Service.find({ published: true }).sort({ displayOrder: 1, createdAt: 1 });
    if (services && services.length > 0) {
      return res.status(200).json({
        status: "success",
        results: services.length,
        data: { services }
      });
    }
  } catch (error) {
    console.warn("[Services Controller] DB fetch failed, serving default services:", error.message);
  }
  res.status(200).json({
    status: "success",
    results: DEFAULT_SERVICES.length,
    data: { services: DEFAULT_SERVICES }
  });
});
var getServiceBySlug = catchAsync(async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, published: true });
    if (service) {
      return res.status(200).json({
        status: "success",
        data: { service }
      });
    }
  } catch (error) {
    console.warn("[Services Controller] DB slug fetch failed, serving fallback:", error.message);
  }
  const fallback = DEFAULT_SERVICES.find((s) => s.slug === req.params.slug);
  if (fallback) {
    return res.status(200).json({
      status: "success",
      data: { service: fallback }
    });
  }
  return next(new AppError("Service not found", 404));
});
var getAllAdminServices = catchAsync(async (_req, res) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1, createdAt: 1 });
    if (services && services.length > 0) {
      return res.status(200).json({
        status: "success",
        results: services.length,
        data: { services }
      });
    }
  } catch (error) {
    console.warn("[Admin Services] DB fetch failed, serving default services:", error.message);
  }
  res.status(200).json({
    status: "success",
    results: DEFAULT_SERVICES.length,
    data: { services: DEFAULT_SERVICES }
  });
});
var createService = catchAsync(async (req, res) => {
  const newService = await Service.create(req.body);
  res.status(201).json({
    status: "success",
    data: { service: newService }
  });
});
var updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!service) {
    return next(new AppError("Service not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { service }
  });
});
var deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    return next(new AppError("Service not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null
  });
});

// server/src/routes/serviceRoutes.ts
var router2 = (0, import_express2.Router)();
router2.get("/", getServices);
router2.get("/:slug", getServiceBySlug);
router2.use(protect);
router2.get("/admin/all", getAllAdminServices);
router2.post("/admin", restrictTo("SUPER_ADMIN", "ADMIN"), createService);
router2.patch("/admin/:id", restrictTo("SUPER_ADMIN", "ADMIN", "EDITOR"), updateService);
router2.delete("/admin/:id", restrictTo("SUPER_ADMIN", "ADMIN"), deleteService);
var serviceRoutes_default = router2;

// server/src/routes/leadRoutes.ts
var import_express3 = require("express");

// server/src/models/Lead.ts
var import_mongoose3 = __toESM(require("mongoose"));
var leadSchema = new import_mongoose3.Schema(
  {
    leadNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    serviceId: { type: import_mongoose3.Schema.Types.ObjectId, ref: "Service" },
    serviceName: { type: String, required: true, default: "General Consultation" },
    customerType: { type: String, enum: ["Individual", "Business"], default: "Individual" },
    message: { type: String, default: "" },
    preferredContactMethod: { type: String, enum: ["Call", "WhatsApp", "Email"], default: "Call" },
    preferredContactTime: { type: String, default: "Anytime" },
    whatsappConsent: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "In Discussion", "Follow-Up", "Converted", "Closed", "Rejected"],
      default: "New"
    },
    notes: [
      {
        author: { type: String, required: true },
        note: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    source: { type: String, default: "Website Form" }
  },
  { timestamps: true }
);
var Lead = import_mongoose3.default.model("Lead", leadSchema);

// server/src/controllers/leadController.ts
var generateLeadNumber = () => {
  const randomDigits = Math.floor(1e3 + Math.random() * 9e3);
  return `VTS-${randomDigits}`;
};
var submitLead = catchAsync(async (req, res, next) => {
  if (req.body.website_url) {
    return res.status(200).json({ status: "success", message: "Enquiry received" });
  }
  const { name, phone, email, serviceName, customerType, message, preferredContactMethod, preferredContactTime, whatsappConsent } = req.body;
  if (!name || !phone || !email) {
    return next(new AppError("Please provide required contact details (Name, Phone, Email)", 400));
  }
  const leadNumber = generateLeadNumber();
  const newLead = await Lead.create({
    leadNumber,
    name,
    phone,
    email,
    serviceName: serviceName || "General Tax Consultation",
    customerType: customerType || "Individual",
    message: message || "",
    preferredContactMethod: preferredContactMethod || "Call",
    preferredContactTime: preferredContactTime || "Anytime",
    whatsappConsent: whatsappConsent !== void 0 ? whatsappConsent : true,
    status: "New",
    source: "Website Enquiry Form"
  });
  res.status(201).json({
    status: "success",
    message: "Your enquiry has been received successfully. Our team will contact you shortly.",
    data: {
      leadNumber: newLead.leadNumber
    }
  });
});
var getAdminLeads = catchAsync(async (req, res) => {
  const { status, service, search } = req.query;
  const filter = {};
  if (status && status !== "ALL") {
    filter.status = status;
  }
  if (service && service !== "ALL") {
    filter.serviceName = service;
  }
  if (search) {
    const searchRegex = new RegExp(String(search), "i");
    filter.$or = [
      { name: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
      { leadNumber: searchRegex },
      { serviceName: searchRegex }
    ];
  }
  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    results: leads.length,
    data: { leads }
  });
});
var getLeadById = catchAsync(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new AppError("Lead not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { lead }
  });
});
var updateLeadStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!lead) {
    return next(new AppError("Lead not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { lead }
  });
});
var addLeadNote = catchAsync(async (req, res, next) => {
  const { note } = req.body;
  if (!note) {
    return next(new AppError("Note content is required", 400));
  }
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new AppError("Lead not found", 404));
  }
  const authorName = req.user?.name || "Admin";
  lead.notes.push({
    author: authorName,
    note,
    createdAt: /* @__PURE__ */ new Date()
  });
  await lead.save();
  res.status(200).json({
    status: "success",
    data: { lead }
  });
});
var deleteLead = catchAsync(async (req, res, next) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    return next(new AppError("Lead not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null
  });
});
var exportLeadsCSV = catchAsync(async (_req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  const headers = "Lead ID,Name,Phone,Email,Service,Type,Status,Method,Date,Message\n";
  const rows = leads.map((l) => {
    const cleanMessage = (l.message || "").replace(/"/g, '""');
    return `"${l.leadNumber}","${l.name}","${l.phone}","${l.email}","${l.serviceName}","${l.customerType}","${l.status}","${l.preferredContactMethod}","${l.createdAt.toISOString()}","${cleanMessage}"`;
  }).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=vihaan_tax_leads.csv");
  res.status(200).send(headers + rows);
});

// server/src/routes/leadRoutes.ts
var router3 = (0, import_express3.Router)();
router3.post("/", submitLead);
router3.use(protect);
router3.get("/admin", getAdminLeads);
router3.get("/admin/export", exportLeadsCSV);
router3.get("/admin/:id", getLeadById);
router3.patch("/admin/:id/status", updateLeadStatus);
router3.post("/admin/:id/notes", addLeadNote);
router3.delete("/admin/:id", restrictTo("SUPER_ADMIN", "ADMIN"), deleteLead);
var leadRoutes_default = router3;

// server/src/routes/testimonialRoutes.ts
var import_express4 = require("express");

// server/src/models/Testimonial.ts
var import_mongoose4 = __toESM(require("mongoose"));
var testimonialSchema = new import_mongoose4.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, default: "Client" },
    company: { type: String, default: "" },
    image: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    content: { type: String, required: true },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);
var Testimonial = import_mongoose4.default.model("Testimonial", testimonialSchema);

// server/src/controllers/testimonialController.ts
var getTestimonials = catchAsync(async (_req, res) => {
  try {
    const testimonials = await Testimonial.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 });
    if (testimonials && testimonials.length > 0) {
      return res.status(200).json({
        status: "success",
        results: testimonials.length,
        data: { testimonials }
      });
    }
  } catch (error) {
    console.warn("[Testimonial Controller] DB fetch failed, serving default testimonials:", error.message);
  }
  res.status(200).json({
    status: "success",
    results: DEFAULT_TESTIMONIALS.length,
    data: { testimonials: DEFAULT_TESTIMONIALS }
  });
});
var getAdminTestimonials = catchAsync(async (_req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });
    if (testimonials && testimonials.length > 0) {
      return res.status(200).json({
        status: "success",
        results: testimonials.length,
        data: { testimonials }
      });
    }
  } catch (error) {
    console.warn("[Admin Testimonials] DB fetch failed, serving default testimonials:", error.message);
  }
  res.status(200).json({
    status: "success",
    results: DEFAULT_TESTIMONIALS.length,
    data: { testimonials: DEFAULT_TESTIMONIALS }
  });
});
var createTestimonial = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({
    status: "success",
    data: { testimonial }
  });
});
var updateTestimonial = catchAsync(async (req, res, next) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!testimonial) {
    return next(new AppError("Testimonial not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { testimonial }
  });
});
var deleteTestimonial = catchAsync(async (req, res, next) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    return next(new AppError("Testimonial not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null
  });
});

// server/src/routes/testimonialRoutes.ts
var router4 = (0, import_express4.Router)();
router4.get("/", getTestimonials);
router4.use(protect);
router4.get("/admin/all", getAdminTestimonials);
router4.post("/admin", restrictTo("SUPER_ADMIN", "ADMIN"), createTestimonial);
router4.patch("/admin/:id", restrictTo("SUPER_ADMIN", "ADMIN", "EDITOR"), updateTestimonial);
router4.delete("/admin/:id", restrictTo("SUPER_ADMIN", "ADMIN"), deleteTestimonial);
var testimonialRoutes_default = router4;

// server/src/routes/faqRoutes.ts
var import_express5 = require("express");

// server/src/models/FAQ.ts
var import_mongoose5 = __toESM(require("mongoose"));
var faqSchema = new import_mongoose5.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: ["GST", "ITR", "Accounting", "Business Registration", "Audit", "General"],
      default: "General"
    },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);
var FAQ = import_mongoose5.default.model("FAQ", faqSchema);

// server/src/controllers/faqController.ts
var getFAQs = catchAsync(async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { published: true };
    if (category && category !== "ALL") {
      filter.category = category;
    }
    const faqs = await FAQ.find(filter).sort({ displayOrder: 1, createdAt: 1 });
    if (faqs && faqs.length > 0) {
      return res.status(200).json({
        status: "success",
        results: faqs.length,
        data: { faqs }
      });
    }
  } catch (error) {
    console.warn("[FAQ Controller] DB fetch failed, serving default FAQs:", error.message);
  }
  res.status(200).json({
    status: "success",
    results: DEFAULT_FAQS.length,
    data: { faqs: DEFAULT_FAQS }
  });
});
var getAdminFAQs = catchAsync(async (_req, res) => {
  try {
    const faqs = await FAQ.find().sort({ displayOrder: 1, createdAt: 1 });
    if (faqs && faqs.length > 0) {
      return res.status(200).json({
        status: "success",
        results: faqs.length,
        data: { faqs }
      });
    }
  } catch (error) {
    console.warn("[Admin FAQ] DB fetch failed, serving default FAQs:", error.message);
  }
  res.status(200).json({
    status: "success",
    results: DEFAULT_FAQS.length,
    data: { faqs: DEFAULT_FAQS }
  });
});
var createFAQ = catchAsync(async (req, res) => {
  const faq = await FAQ.create(req.body);
  res.status(201).json({
    status: "success",
    data: { faq }
  });
});
var updateFAQ = catchAsync(async (req, res, next) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!faq) {
    return next(new AppError("FAQ not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { faq }
  });
});
var deleteFAQ = catchAsync(async (req, res, next) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) {
    return next(new AppError("FAQ not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null
  });
});

// server/src/routes/faqRoutes.ts
var router5 = (0, import_express5.Router)();
router5.get("/", getFAQs);
router5.use(protect);
router5.get("/admin/all", getAdminFAQs);
router5.post("/admin", restrictTo("SUPER_ADMIN", "ADMIN"), createFAQ);
router5.patch("/admin/:id", restrictTo("SUPER_ADMIN", "ADMIN", "EDITOR"), updateFAQ);
router5.delete("/admin/:id", restrictTo("SUPER_ADMIN", "ADMIN"), deleteFAQ);
var faqRoutes_default = router5;

// server/src/routes/mediaRoutes.ts
var import_express6 = require("express");

// server/src/models/Media.ts
var import_mongoose6 = __toESM(require("mongoose"));
var mediaSchema = new import_mongoose6.Schema(
  {
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    altText: { type: String, default: "" },
    mimeType: { type: String, default: "image/jpeg" },
    size: { type: Number, default: 0 },
    uploadedBy: { type: String, default: "Admin" }
  },
  { timestamps: true }
);
var Media = import_mongoose6.default.model("Media", mediaSchema);

// server/src/config/cloudinary.ts
var import_cloudinary = require("cloudinary");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
import_cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "1234567890",
  api_secret: process.env.CLOUDINARY_API_SECRET || "secret"
});
var isCloudinaryConfigured = () => {
  return !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME !== "demo";
};
var cloudinary_default = import_cloudinary.v2;

// server/src/controllers/mediaController.ts
var import_fs = __toESM(require("fs"));
var uploadMedia = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please select an image file to upload", 400));
  }
  let fileUrl = `/uploads/${req.file.filename}`;
  let publicId = "";
  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary_default.uploader.upload(req.file.path, {
        folder: "vihaan-tax-solutions"
      });
      fileUrl = result.secure_url;
      publicId = result.public_id;
      if (import_fs.default.existsSync(req.file.path)) {
        import_fs.default.unlinkSync(req.file.path);
      }
    } catch (err) {
      console.warn("Cloudinary upload warning, fallback to local URL:", err);
    }
  }
  const media = await Media.create({
    fileName: req.file.originalname,
    url: fileUrl,
    publicId,
    altText: req.body.altText || req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedBy: req.user?.name || "Admin"
  });
  res.status(201).json({
    status: "success",
    data: { media }
  });
});
var getMediaList = catchAsync(async (_req, res) => {
  const mediaList = await Media.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    results: mediaList.length,
    data: { media: mediaList }
  });
});
var deleteMedia = catchAsync(async (req, res, next) => {
  const media = await Media.findById(req.params.id);
  if (!media) {
    return next(new AppError("Media item not found", 404));
  }
  if (media.publicId && isCloudinaryConfigured()) {
    try {
      await cloudinary_default.uploader.destroy(media.publicId);
    } catch (e) {
      console.warn("Could not delete from Cloudinary:", e);
    }
  }
  await media.deleteOne();
  res.status(204).json({
    status: "success",
    data: null
  });
});

// server/src/middleware/uploadMiddleware.ts
var import_multer = __toESM(require("multer"));
var import_path = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));
var import_os = __toESM(require("os"));
var uploadDir = process.env.VERCEL || process.env.NODE_ENV === "production" ? import_path.default.join(import_os.default.tmpdir(), "uploads") : import_path.default.join(process.cwd(), "uploads");
try {
  if (!import_fs2.default.existsSync(uploadDir)) {
    import_fs2.default.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn("[Upload Directory Warning]", err.message);
}
var storage = import_multer.default.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = import_path.default.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});
var fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type. Only JPG, PNG, WEBP, and SVG images are allowed.", 400));
  }
};
var upload = (0, import_multer.default)({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
  // 10MB limit
});

// server/src/routes/mediaRoutes.ts
var router6 = (0, import_express6.Router)();
router6.use(protect);
router6.post("/admin", upload.single("image"), uploadMedia);
router6.get("/admin", getMediaList);
router6.delete("/admin/:id", restrictTo("SUPER_ADMIN", "ADMIN"), deleteMedia);
var mediaRoutes_default = router6;

// server/src/routes/settingRoutes.ts
var import_express7 = require("express");

// server/src/models/Setting.ts
var import_mongoose7 = __toESM(require("mongoose"));
var settingSchema = new import_mongoose7.Schema(
  {
    companyName: { type: String, default: "Vihaan Tax Solutions" },
    tagline: { type: String, default: "Trusted, Confidential and Professional Tax & Advisory" },
    phone: { type: String, default: "+91 78610 96198" },
    email: { type: String, default: "Info.vihaantax@gmail.com" },
    whatsapp: { type: String, default: "917861096198" },
    address: { type: String, default: "Vihaan Tax Solutions Office, Consultancy Chambers, India" },
    mapEmbedUrl: { type: String, default: "https://maps.google.com/maps?q=India&t=&z=13&ie=UTF8&iwloc=&output=embed" },
    officeHours: { type: String, default: "Monday - Saturday: 9:30 AM - 7:00 PM" },
    consultant: {
      name: { type: String, default: "Mr. Vilas Joshi" },
      designation: { type: String, default: "Tax Consultant" },
      bio: { type: String, default: "Expert tax advisor assisting individuals and enterprises with tax compliance, GST, accounting, and financial planning." },
      philosophy: { type: String, default: "Delivering clarity in numbers and confidentiality in every consultation." },
      experienceYears: { type: String, default: "10+" },
      image: { type: String, default: "/images/vilas_joshi.png" }
    },
    hero: {
      eyebrow: { type: String, default: "TAX \u2022 GST \u2022 ACCOUNTING \u2022 BUSINESS ADVISORY" },
      heading: { type: String, default: "Clarity in Numbers. Confidence in Every Decision." },
      description: { type: String, default: "Professional tax, GST, accounting, and business advisory services designed to help individuals and businesses stay compliant, reduce unnecessary tax burdens, and make better financial decisions." },
      ctaPrimary: { type: String, default: "Book a Consultation" },
      ctaSecondary: { type: String, default: "Explore Services" },
      heroImage: { type: String, default: "/images/hero.png" }
    },
    trustStats: [
      {
        number: { type: String, default: "10+" },
        label: { type: String, default: "Years Experience" },
        visible: { type: Boolean, default: true }
      },
      {
        number: { type: String, default: "500+" },
        label: { type: String, default: "Clients Assisted" },
        visible: { type: Boolean, default: true }
      },
      {
        number: { type: String, default: "6+" },
        label: { type: String, default: "Core Services" },
        visible: { type: Boolean, default: true }
      },
      {
        number: { type: String, default: "100%" },
        label: { type: String, default: "Client Confidentiality" },
        visible: { type: Boolean, default: true }
      }
    ],
    socialLinks: {
      whatsapp: { type: String, default: "https://wa.me/917861096198" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" }
    },
    globalSeo: {
      metaTitle: { type: String, default: "Vihaan Tax Solutions | CA & Tax Consultancy" },
      metaDescription: { type: String, default: "Expert GST Registration, GST Returns, Accounting, Audit, Firm Registration, and ITR Filing services by Mr. Vilas Joshi." },
      keywords: [{ type: String }],
      ogImage: { type: String, default: "" }
    }
  },
  { timestamps: true }
);
var Setting = import_mongoose7.default.model("Setting", settingSchema);

// server/src/controllers/settingController.ts
var getPublicSettings = catchAsync(async (_req, res) => {
  try {
    let settings = await Setting.findOne();
    if (settings) {
      return res.status(200).json({
        status: "success",
        data: { settings }
      });
    }
  } catch (error) {
    console.warn("[Settings Controller] DB fetch failed, serving default settings:", error.message);
  }
  res.status(200).json({
    status: "success",
    data: { settings: DEFAULT_SETTINGS }
  });
});
var updateAdminSettings = catchAsync(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  res.status(200).json({
    status: "success",
    data: { settings }
  });
});

// server/src/routes/settingRoutes.ts
var router7 = (0, import_express7.Router)();
router7.get("/public", getPublicSettings);
router7.use(protect);
router7.patch("/admin", restrictTo("SUPER_ADMIN", "ADMIN", "EDITOR"), updateAdminSettings);
var settingRoutes_default = router7;

// server/src/routes/dashboardRoutes.ts
var import_express8 = require("express");

// server/src/controllers/dashboardController.ts
var getDashboardStats = catchAsync(async (_req, res) => {
  const [totalLeads, newLeads, inDiscussionLeads, convertedLeads, totalServices, publishedTestimonials] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: "New" }),
    Lead.countDocuments({ status: "In Discussion" }),
    Lead.countDocuments({ status: "Converted" }),
    Service.countDocuments(),
    Testimonial.countDocuments({ published: true })
  ]);
  const leadsByServiceRaw = await Lead.aggregate([
    { $group: { _id: "$serviceName", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  const leadsByService = leadsByServiceRaw.map((item) => ({
    name: item._id || "General",
    count: item.count
  }));
  const leadsByStatusRaw = await Lead.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  const leadsByStatus = leadsByStatusRaw.map((item) => ({
    status: item._id,
    count: item.count
  }));
  const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);
  res.status(200).json({
    status: "success",
    data: {
      stats: {
        totalLeads,
        newLeads,
        inDiscussionLeads,
        convertedLeads,
        totalServices,
        publishedTestimonials
      },
      leadsByService,
      leadsByStatus,
      recentLeads
    }
  });
});

// server/src/routes/dashboardRoutes.ts
var router8 = (0, import_express8.Router)();
router8.use(protect);
router8.get("/stats", getDashboardStats);
var dashboardRoutes_default = router8;

// server/src/config/db.ts
var import_mongoose8 = __toESM(require("mongoose"));
import_mongoose8.default.set("bufferCommands", false);
var connectDB = async () => {
  if (import_mongoose8.default.connection.readyState >= 1) {
    return;
  }
  try {
    const connStr = process.env.MONGODB_URI || "mongodb+srv://fanqie:fanqie123@cluster0.f8acy45.mongodb.net/tax";
    const conn = await import_mongoose8.default.connect(connStr, {
      serverSelectionTimeoutMS: 3e3
    });
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection Warning: ${error.message}`);
  }
};

// server/src/middleware/errorHandler.ts
var globalErrorHandler = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", err);
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...process.env.NODE_ENV === "development" && { stack: err.stack, error: err }
  });
};

// server/src/app.ts
import_dotenv2.default.config();
var app = (0, import_express9.default)();
app.set("trust proxy", 1);
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn("[Database Connection Warning]", err);
  }
  next();
});
app.use(
  (0, import_helmet.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(
  (0, import_cors.default)({
    origin: true,
    credentials: true
  })
);
var apiLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  max: 500,
  validate: { trustProxy: false, xForwardedForHeader: false }
});
app.use("/api", apiLimiter);
app.use(import_express9.default.json({ limit: "10mb" }));
app.use(import_express9.default.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", import_express9.default.static(import_path2.default.join(process.cwd(), "uploads")));
app.get(["/api/v1/health", "/v1/health"], (_req, res) => {
  res.status(200).json({ status: "ok", message: "Vihaan Tax Solutions API is operational" });
});
app.use(["/api/v1/auth", "/v1/auth", "/auth"], authRoutes_default);
app.use(["/api/v1/services", "/v1/services", "/services"], serviceRoutes_default);
app.use(["/api/v1/leads", "/v1/leads", "/leads"], leadRoutes_default);
app.use(["/api/v1/testimonials", "/v1/testimonials", "/testimonials"], testimonialRoutes_default);
app.use(["/api/v1/faqs", "/v1/faqs", "/faqs"], faqRoutes_default);
app.use(["/api/v1/media", "/v1/media", "/media"], mediaRoutes_default);
app.use(["/api/v1/settings", "/v1/settings", "/settings"], settingRoutes_default);
app.use(["/api/v1/dashboard", "/v1/dashboard", "/dashboard"], dashboardRoutes_default);
app.all("*", (req, _res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
var app_default = app;
module.exports = app_default;
