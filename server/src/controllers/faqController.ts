import { Request, Response, NextFunction } from 'express';
import { FAQ } from '../models/FAQ';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

export const getFAQs = catchAsync(async (req: Request, res: Response) => {
  const { category } = req.query;
  const filter: any = { published: true };
  if (category && category !== 'ALL') {
    filter.category = category;
  }
  const faqs = await FAQ.find(filter).sort({ displayOrder: 1, createdAt: 1 });
  res.status(200).json({
    status: 'success',
    results: faqs.length,
    data: { faqs },
  });
});

export const getAdminFAQs = catchAsync(async (_req: Request, res: Response) => {
  const faqs = await FAQ.find().sort({ displayOrder: 1, createdAt: 1 });
  res.status(200).json({
    status: 'success',
    results: faqs.length,
    data: { faqs },
  });
});

export const createFAQ = catchAsync(async (req: Request, res: Response) => {
  const faq = await FAQ.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { faq },
  });
});

export const updateFAQ = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!faq) {
    return next(new AppError('FAQ not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { faq },
  });
});

export const deleteFAQ = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) {
    return next(new AppError('FAQ not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
