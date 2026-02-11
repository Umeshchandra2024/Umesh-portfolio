import Message from '../models/Message.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/error.js';

export const createMessage = catchAsyncError(async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json({ success: true, message, info: 'Message sent successfully' });
});

export const getMessages = catchAsyncError(async (_req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, messages });
});

export const markAsRead = catchAsyncError(async (req, res, next) => {
  let message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorHandler('Message not found', 404));
  }

  message.read = true;
  await message.save();

  res.status(200).json({ success: true, message, info: 'Message marked as read' });
});

export const deleteMessage = catchAsyncError(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorHandler('Message not found', 404));
  }

  await message.deleteOne();

  res.status(200).json({ success: true, info: 'Message deleted successfully' });
});

