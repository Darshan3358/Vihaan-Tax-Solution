import { Request, Response, NextFunction } from 'express';
import { Testimonial } from '../models/Testimonial';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

export const getTestimonials = catchAsync(async (_req: Request, res: Response) => {
  const testimonials = await Testimonial.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: testimonials.length,
    data: { testimonials },
  });
});

export const getAdminTestimonials = catchAsync(async (_req: Request, res: Response) => {
  const testimonials = await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: testimonials.length,
    data: { testimonials },
  });
});

export const createTestimonial = catchAsync(async (req: Request, res: Response) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { testimonial },
  });
});

export const updateTestimonial = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!testimonial) {
    return next(new AppError('Testimonial not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { testimonial },
  });
});

export const deleteTestimonial = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    return next(new AppError('Testimonial not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
