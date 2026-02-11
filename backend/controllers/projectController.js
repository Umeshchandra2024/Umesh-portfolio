import cloudinary from 'cloudinary';
import Project from '../models/Project.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/error.js';

export const getProjects = catchAsyncError(async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, projects });
});

export const addProject = catchAsyncError(async (req, res) => {
  const { title, description, techStack, githubUrl, liveUrl, featured, order } = req.body;

  let image;
  if (req.files?.image) {
    const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
      folder: 'portfolio/projects',
    });
    image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
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

