import Resume from '../models/Resume.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';

export const getResume = catchAsyncError(async (_req, res) => {
  const resume = await Resume.findOne().sort({ updatedAt: -1 });
  res.status(200).json({ success: true, resume: resume || null });
});

export const updateResume = catchAsyncError(async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'Resume URL is required' });
  }
  const resume = await Resume.findOneAndUpdate(
    {},
    { url },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.status(200).json({ success: true, resume, message: 'Resume updated successfully' });
});
