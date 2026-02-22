import cloudinary from 'cloudinary';
import Skill from '../models/Skill.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/error.js';

export const getSkills = catchAsyncError(async (_req, res) => {
  const skills = await Skill.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, skills });
});

export const addSkill = catchAsyncError(async (req, res) => {
  const { name, level, category, order } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new ErrorHandler('Skill name is required', 400);
  }

  let logo;
  if (req.files?.logo?.tempFilePath) {
    const result = await cloudinary.v2.uploader.upload(req.files.logo.tempFilePath, {
      folder: 'portfolio/skills',
    });
    logo = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const skill = await Skill.create({
    name: name.trim(),
    level: level || 'advanced',
    category: category || 'general',
    order: order !== undefined && order !== '' ? Number(order) : 0,
    logo,
  });

  res.status(201).json({ success: true, skill, message: 'Skill added successfully' });
});

export const updateSkill = catchAsyncError(async (req, res, next) => {
  let skill = await Skill.findById(req.params.id);

  if (!skill) {
    return next(new ErrorHandler('Skill not found', 404));
  }

  if (req.files?.logo?.tempFilePath) {
    if (skill.logo?.public_id) {
      await cloudinary.v2.uploader.destroy(skill.logo.public_id);
    }
    const result = await cloudinary.v2.uploader.upload(req.files.logo.tempFilePath, {
      folder: 'portfolio/skills',
    });
    req.body.logo = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const updateFields = { ...req.body };
  if (updateFields.order !== undefined && updateFields.order !== '') {
    updateFields.order = Number(updateFields.order);
  }
  if (updateFields.name && typeof updateFields.name === 'string') {
    updateFields.name = updateFields.name.trim();
  }

  skill = await Skill.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, skill, message: 'Skill updated successfully' });
});

export const deleteSkill = catchAsyncError(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    return next(new ErrorHandler('Skill not found', 404));
  }

  if (skill.logo?.public_id) {
    await cloudinary.v2.uploader.destroy(skill.logo.public_id);
  }

  await skill.deleteOne();

  res.status(200).json({ success: true, message: 'Skill deleted successfully' });
});

