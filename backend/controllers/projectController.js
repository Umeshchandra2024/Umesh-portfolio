import cloudinary from 'cloudinary';
import Project from '../models/Project.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/error.js';

export const getProjects = catchAsyncError(async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, projects });
});

export const addProject = catchAsyncError(async (req, res, next) => {
  const title = req.body?.title;
  const description = req.body?.description;
  const githubUrl = req.body?.githubUrl || '';
  const liveUrl = req.body?.liveUrl || '';
  const techStack = req.body?.techStack ? (Array.isArray(req.body.techStack) ? req.body.techStack : [req.body.techStack]) : [];
  const featured = req.body?.featured === 'true' || req.body?.featured === true;
  const order = req.body?.order != null ? Number(req.body.order) : 0;

  if (!title || !description) {
    return next(new ErrorHandler('Title and description are required', 400));
  }

  let image;
  if (req.files?.image?.tempFilePath) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
        folder: 'portfolio/projects',
      });
      image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (err) {
      return next(new ErrorHandler('Image upload failed. Check Cloudinary config. ' + (err.message || ''), 400));
    }
  }

  const project = await Project.create({
    title,
    description,
    techStack,
    githubUrl,
    liveUrl,
    featured,
    order,
    image,
  });

  res.status(201).json({ success: true, project, message: 'Project added successfully' });
});

export const updateProject = catchAsyncError(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorHandler('Project not found', 404));
  }

  if (req.files?.image) {
    if (project.image?.public_id) {
      await cloudinary.v2.uploader.destroy(project.image.public_id);
    }
    const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
      folder: 'portfolio/projects',
    });
    req.body.image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, project, message: 'Project updated successfully' });
});

export const deleteProject = catchAsyncError(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorHandler('Project not found', 404));
  }

  if (project.image?.public_id) {
    await cloudinary.v2.uploader.destroy(project.image.public_id);
  }

  await project.deleteOne();

  res.status(200).json({ success: true, message: 'Project deleted successfully' });
});

