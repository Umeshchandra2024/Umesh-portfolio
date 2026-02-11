import jwt from 'jsonwebtoken';
import { ErrorHandler } from './error.js';
import { catchAsyncError } from './catchAsyncError.js';
import User from '../models/User.js';

export const isAuthenticated = catchAsyncError(async (req, _res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler('Please login to access this resource', 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);
  if (!req.user) {
    return next(new ErrorHandler('User not found', 404));
  }

  next();
});

export const authorizeRoles = (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403),
      );
    }
    next();
  };

