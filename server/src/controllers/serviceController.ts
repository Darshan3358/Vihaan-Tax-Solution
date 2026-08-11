import { Request, Response, NextFunction } from 'express';
import { Service } from '../models/Service';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

export const getServices = catchAsync(async (_req: Request, res: Response) => {
  const services = await Service.find({ published: true }).sort({ displayOrder: 1, createdAt: 1 });
  res.status(200).json({
    status: 'success',
    results: services.length,
    data: { services },
  });
});

export const getServiceBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const service = await Service.findOne({ slug: req.params.slug, published: true });
  if (!service) {
    return next(new AppError('Service not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { service },
  });
});

export const getAllAdminServices = catchAsync(async (_req: Request, res: Response) => {
  const services = await Service.find().sort({ displayOrder: 1, createdAt: 1 });
  res.status(200).json({
    status: 'success',
    results: services.length,
    data: { services },
  });
});

export const createService = catchAsync(async (req: Request, res: Response) => {
  const newService = await Service.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { service: newService },
  });
});

export const updateService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    return next(new AppError('Service not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { service },
  });
});

export const deleteService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    return next(new AppError('Service not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
