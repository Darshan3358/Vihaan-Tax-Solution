import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middleware/authMiddleware';

const signToken = (id: string) => {
  const secret = process.env.JWT_SECRET || 'vihaan_tax_solutions_super_secret_jwt_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });
};

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (user.status !== 'ACTIVE') {
    return next(new AppError('Account is inactive. Please contact administration.', 403));
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id.toString());
  user.passwordHash = undefined as any;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

export const changePassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current and new password', 400));
  }

  const user = await User.findById(req.user?._id).select('+passwordHash');
  if (!user || !(await user.correctPassword(currentPassword))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  const token = signToken(user._id.toString());

  res.status(200).json({
    status: 'success',
    token,
    message: 'Password updated successfully',
  });
});
