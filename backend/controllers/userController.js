import cloudinary from 'cloudinary';
import User from '../models/User.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/error.js';
import { sendToken } from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password, about } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new ErrorHandler('User already exists with this email', 400));
  }

  let avatar;
  if (req.files?.avatar) {
    const result = await cloudinary.v2.uploader.upload(req.files.avatar.tempFilePath, {
      folder: 'portfolio/avatar',
    });
    avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.create({
    name,
    email,
    password,
    about,
    avatar,
  });

  sendToken(user, 'Registered successfully', 201, res);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  sendToken(user, 'Logged in successfully', 200, res);
});

export const logout = catchAsyncError(async (_req, res) => {
  res
    .status(200)
    .cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'Logged out successfully',
    });
});

export const getMe = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, user });
});

export const updateProfile = catchAsyncError(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    about: req.body.about,
  };

  if (req.files?.avatar) {
    const user = await User.findById(req.user._id);
    if (user.avatar?.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }
    const result = await cloudinary.v2.uploader.upload(req.files.avatar.tempFilePath, {
      folder: 'portfolio/avatar',
    });
    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user, message: 'Profile updated successfully' });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.DASHBOARD_URL || process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `You requested a password reset.\n\nPlease click on the link to reset your password:\n${resetPasswordUrl}\n\nIf you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Portfolio dashboard password recovery',
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const crypto = await import('crypto');

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('Reset password token is invalid or has expired', 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password and confirm password do not match', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 'Password reset successfully', 200, res);
});

