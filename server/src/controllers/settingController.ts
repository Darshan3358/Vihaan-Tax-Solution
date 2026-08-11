import { Request, Response } from 'express';
import { Setting } from '../models/Setting';
import { catchAsync } from '../utils/catchAsync';
import { DEFAULT_SETTINGS } from '../utils/defaultData';

export const getPublicSettings = catchAsync(async (_req: Request, res: Response) => {
  try {
    let settings = await Setting.findOne();
    if (settings) {
      return res.status(200).json({
        status: 'success',
        data: { settings },
      });
    }
  } catch (error) {
    console.warn('[Settings Controller] DB fetch failed, serving default settings:', (error as Error).message);
  }

  res.status(200).json({
    status: 'success',
    data: { settings: DEFAULT_SETTINGS },
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
