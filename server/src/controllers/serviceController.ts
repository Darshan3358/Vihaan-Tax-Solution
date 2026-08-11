import { Request, Response, NextFunction } from 'express';
import { Service } from '../models/Service';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { DEFAULT_SERVICES } from '../utils/defaultData';

export const getServices = catchAsync(async (_req: Request, res: Response) => {
  try {
    const services = await Service.find({ published: true }).sort({ displayOrder: 1, createdAt: 1 });
    if (services && services.length > 0) {
      return res.status(200).json({
        status: 'success',
        results: services.length,
        data: { services },
      });
    }
  } catch (error) {
    console.warn('[Services Controller] DB fetch failed, serving default services:', (error as Error).message);
  }

  // Fallback to default services
  res.status(200).json({
    status: 'success',
    results: DEFAULT_SERVICES.length,
    data: { services: DEFAULT_SERVICES },
  });
});

export const getServiceBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, published: true });
    if (service) {
      return res.status(200).json({
        status: 'success',
        data: { service },
      });
    }
  } catch (error) {
    console.warn('[Services Controller] DB slug fetch failed, serving fallback:', (error as Error).message);
  }

  const fallback = DEFAULT_SERVICES.find((s) => s.slug === req.params.slug);
  if (fallback) {
    return res.status(200).json({
      status: 'success',
      data: { service: fallback },
    });
  }

  return next(new AppError('Service not found', 404));
});

export const getAllAdminServices = catchAsync(async (_req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1, createdAt: 1 });
    if (services && services.length > 0) {
      return res.status(200).json({
        status: 'success',
        results: services.length,
        data: { services },
      });
    }
  } catch (error) {
    console.warn('[Admin Services] DB fetch failed, serving default services:', (error as Error).message);
  }

  res.status(200).json({
    status: 'success',
    results: DEFAULT_SERVICES.length,
    data: { services: DEFAULT_SERVICES },
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
