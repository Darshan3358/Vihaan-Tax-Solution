import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  const secret = process.env.JWT_SECRET || 'vihaan_tax_solutions_super_secret_jwt_key_2026';
  const decoded = jwt.verify(token, secret) as { id: string };

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  if (currentUser.status !== 'ACTIVE') {
    return next(new AppError('Your account has been deactivated.', 403));
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles: Array<'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
