import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middleware/authMiddleware';

const generateLeadNumber = (): string => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `VTS-${randomDigits}`;
};

export const submitLead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.website_url) {
    return res.status(200).json({ status: 'success', message: 'Enquiry received' });
  }

  const { name, phone, email, serviceName, customerType, message, preferredContactMethod, preferredContactTime, whatsappConsent } = req.body;

  if (!name || !phone || !email) {
    return next(new AppError('Please provide required contact details (Name, Phone, Email)', 400));
  }

  const leadNumber = generateLeadNumber();
  const newLead = await Lead.create({
    leadNumber,
    name,
    phone,
    email,
    serviceName: serviceName || 'General Tax Consultation',
    customerType: customerType || 'Individual',
    message: message || '',
    preferredContactMethod: preferredContactMethod || 'Call',
    preferredContactTime: preferredContactTime || 'Anytime',
    whatsappConsent: whatsappConsent !== undefined ? whatsappConsent : true,
    status: 'New',
    source: 'Website Enquiry Form',
  });

  res.status(201).json({
    status: 'success',
    message: 'Your enquiry has been received successfully. Our team will contact you shortly.',
    data: {
      leadNumber: newLead.leadNumber,
    },
  });
});

export const getAdminLeads = catchAsync(async (req: Request, res: Response) => {
  const { status, service, search } = req.query;
  const filter: any = {};

  if (status && status !== 'ALL') {
    filter.status = status;
  }
  if (service && service !== 'ALL') {
    filter.serviceName = service;
  }
  if (search) {
    const searchRegex = new RegExp(String(search), 'i');
    filter.$or = [
      { name: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
      { leadNumber: searchRegex },
      { serviceName: searchRegex },
    ];
  }

  const leads = await Lead.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: leads.length,
    data: { leads },
  });
});

export const getLeadById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new AppError('Lead not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { lead },
  });
});

export const updateLeadStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!lead) {
    return next(new AppError('Lead not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { lead },
  });
});

export const addLeadNote = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { note } = req.body;
  if (!note) {
    return next(new AppError('Note content is required', 400));
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new AppError('Lead not found', 404));
  }

  const authorName = req.user?.name || 'Admin';
  lead.notes.push({
    author: authorName,
    note,
    createdAt: new Date(),
  });

  await lead.save();

  res.status(200).json({
    status: 'success',
    data: { lead },
  });
});

export const deleteLead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    return next(new AppError('Lead not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const exportLeadsCSV = catchAsync(async (_req: Request, res: Response) => {
  const leads = await Lead.find().sort({ createdAt: -1 });

  const headers = 'Lead ID,Name,Phone,Email,Service,Type,Status,Method,Date,Message\n';
  const rows = leads
    .map((l) => {
      const cleanMessage = (l.message || '').replace(/"/g, '""');
      return `"${l.leadNumber}","${l.name}","${l.phone}","${l.email}","${l.serviceName}","${l.customerType}","${l.status}","${l.preferredContactMethod}","${l.createdAt.toISOString()}","${cleanMessage}"`;
    })
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=vihaan_tax_leads.csv');
  res.status(200).send(headers + rows);
});
