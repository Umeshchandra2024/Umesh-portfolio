import cloudinary from 'cloudinary';
import SoftwareApplication from '../models/SoftwareApplication.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/error.js';

export const getSoftwareApps = catchAsyncError(async (_req, res) => {
  const apps = await SoftwareApplication.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, apps });
});

export const addSoftwareApp = catchAsyncError(async (req, res) => {
  const { name, category, description, url, order } = req.body;

  let logo;
  if (req.files?.logo) {
    const result = await cloudinary.v2.uploader.upload(req.files.logo.tempFilePath, {
      folder: 'portfolio/software',
    });
    logo = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const app = await SoftwareApplication.create({
    name,
    category,
    description,
    url,
    order,
    logo,
  });

  res.status(201).json({ success: true, app, message: 'Application added successfully' });
});

export const updateSoftwareApp = catchAsyncError(async (req, res, next) => {
  let app = await SoftwareApplication.findById(req.params.id);

  if (!app) {
    return next(new ErrorHandler('Application not found', 404));
  }

  if (req.files?.logo) {
    if (app.logo?.public_id) {
      await cloudinary.v2.uploader.destroy(app.logo.public_id);
    }
    const result = await cloudinary.v2.uploader.upload(req.files.logo.tempFilePath, {
      folder: 'portfolio/software',
    });
    req.body.logo = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  app = await SoftwareApplication.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, app, message: 'Application updated successfully' });
});

export const deleteSoftwareApp = catchAsyncError(async (req, res, next) => {
  const app = await SoftwareApplication.findById(req.params.id);

  if (!app) {
    return next(new ErrorHandler('Application not found', 404));
  }

  if (app.logo?.public_id) {
    await cloudinary.v2.uploader.destroy(app.logo.public_id);
  }

  await app.deleteOne();

  res.status(200).json({ success: true, message: 'Application deleted successfully' });
});

