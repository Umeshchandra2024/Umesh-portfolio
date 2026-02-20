import cloudinary from 'cloudinary';
import Project from '../models/Project.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/error.js';

export const getProjects = catchAsyncError(async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  console.log('Fetched projects:', projects.length, 'First project video:', projects[0]?.video);
  res.status(200).json({ success: true, projects });
});

export const getProjectById = catchAsyncError(async (req, res, next) => {
  console.log('getProjectById called with id:', req.params.id);
  const project = await Project.findById(req.params.id);
  if (!project) {
    console.log('Project not found for id:', req.params.id);
    return next(new ErrorHandler('Project not found', 404));
  }
  console.log('Fetching project:', project._id, 'Video:', project.video);
  res.status(200).json({ success: true, project });
});

export const addProject = catchAsyncError(async (req, res, next) => {
  const title = req.body?.title;
  const description = req.body?.description;
  const githubUrl = req.body?.githubUrl || '';
  const liveUrl = req.body?.liveUrl || '';
  const techStack = req.body?.techStack 
    ? (Array.isArray(req.body.techStack) 
        ? req.body.techStack 
        : typeof req.body.techStack === 'string' 
          ? req.body.techStack.split(',').map(t => t.trim()).filter(Boolean)
          : [req.body.techStack])
    : [];
  const featured = req.body?.featured === 'true' || req.body?.featured === true;
  const order = req.body?.order != null ? Number(req.body.order) : 0;

  if (!title || !description) {
    return next(new ErrorHandler('Title and description are required', 400));
  }

  if (!req.files?.video?.tempFilePath) {
    console.error('Video file missing. Files received:', Object.keys(req.files || {}));
    return next(new ErrorHandler('Video file is required', 400));
  }

  let video;
  try {
    console.log('Uploading video to Cloudinary...');
    const result = await cloudinary.v2.uploader.upload(req.files.video.tempFilePath, {
      folder: 'portfolio/projects',
      resource_type: 'video',
    });
    console.log('Video uploaded successfully:', result.secure_url);
    video = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (err) {
    console.error('Video upload error:', err);
    return next(new ErrorHandler('Video upload failed. Check Cloudinary config. ' + (err.message || ''), 400));
  }

  const project = await Project.create({
    title,
    description,
    techStack,
    githubUrl,
    liveUrl,
    video,
    featured,
    order,
  });

  console.log('Project created:', project._id, 'Video URL:', project.video?.url);
  res.status(201).json({ success: true, project, message: 'Project added successfully' });
});

export const updateProject = catchAsyncError(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorHandler('Project not found', 404));
  }

  // Handle video file upload
  if (req.files?.video?.tempFilePath) {
    // Delete old video if exists
    if (project.video?.public_id) {
      try {
        await cloudinary.v2.uploader.destroy(project.video.public_id, { resource_type: 'video' });
      } catch (err) {
        console.error('Error deleting old video:', err);
      }
    }
    // Upload new video
    try {
      const result = await cloudinary.v2.uploader.upload(req.files.video.tempFilePath, {
        folder: 'portfolio/projects',
        resource_type: 'video',
      });
      req.body.video = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (err) {
      return next(new ErrorHandler('Video upload failed. ' + (err.message || ''), 400));
    }
  }

  // Handle techStack if it's a string (comma-separated)
  if (req.body?.techStack && typeof req.body.techStack === 'string') {
    req.body.techStack = req.body.techStack.split(',').map(t => t.trim()).filter(Boolean);
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

  // Delete video from Cloudinary
  if (project.video?.public_id) {
    try {
      await cloudinary.v2.uploader.destroy(project.video.public_id, { resource_type: 'video' });
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  }

  await project.deleteOne();

  res.status(200).json({ success: true, message: 'Project deleted successfully' });
});

