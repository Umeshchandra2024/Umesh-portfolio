import Timeline from '../models/Timeline.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/error.js';

export const getTimeline = catchAsyncError(async (_req, res) => {
  const items = await Timeline.find().sort({ order: 1, startDate: -1 });
  res.status(200).json({ success: true, timeline: items });
});

export const addTimelineItem = catchAsyncError(async (req, res) => {
  const item = await Timeline.create(req.body);
  res.status(201).json({ success: true, item, message: 'Timeline item added successfully' });
});

export const updateTimelineItem = catchAsyncError(async (req, res, next) => {
  let item = await Timeline.findById(req.params.id);

  if (!item) {
    return next(new ErrorHandler('Timeline item not found', 404));
  }

  item = await Timeline.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, item, message: 'Timeline item updated successfully' });
});

export const deleteTimelineItem = catchAsyncError(async (req, res, next) => {
  const item = await Timeline.findById(req.params.id);

  if (!item) {
    return next(new ErrorHandler('Timeline item not found', 404));
  }

  await item.deleteOne();

  res.status(200).json({ success: true, message: 'Timeline item deleted successfully' });
});

