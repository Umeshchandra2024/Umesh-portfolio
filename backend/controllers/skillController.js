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

  let logo;
  if (req.files?.logo) {
    const result = await cloudinary.v2.uploader.upload(req.files.logo.tempFilePath, {
      folder: 'portfolio/skills',
    });
    logo = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const skill = await Skill.create({
    name,
    level,
    category,
    order,
    logo,
  });

  res.status(201).json({ success: true, skill, message: 'Skill added successfully' });
});

export const updateSkill = catchAsyncError(async (req, res, next) => {
  let skill = await Skill.findById(req.params.id);

  if (!skill) {
    return next(new ErrorHandler('Skill not found', 404));
  }

  if (req.files?.logo) {
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

  skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
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

