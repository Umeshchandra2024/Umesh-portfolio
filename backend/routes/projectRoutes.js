import express from 'express';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProjects);

// Admin only
router.post('/', isAuthenticated, addProject);
router
  .route('/:id')
  .put(isAuthenticated, updateProject)
  .delete(isAuthenticated, deleteProject);

export default router;

