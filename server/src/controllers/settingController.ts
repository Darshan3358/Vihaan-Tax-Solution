import { Request, Response } from 'express';
import { Setting } from '../models/Setting';
import { catchAsync } from '../utils/catchAsync';

export const getPublicSettings = catchAsync(async (_req: Request, res: Response) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  res.status(200).json({
    status: 'success',
    data: { settings },
  });
});

export const updateAdminSettings = catchAsync(async (req: Request, res: Response) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }

  res.status(200).json({
    status: 'success',
    data: { settings },
  });
});
