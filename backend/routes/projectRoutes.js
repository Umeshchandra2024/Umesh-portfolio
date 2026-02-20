import express from 'express';
import {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes - must be before admin routes
router.get('/', getProjects);
// Make sure this route is registered
router.get('/:id', (req, res, next) => {
  console.log('Route /:id matched, id:', req.params.id);
  getProjectById(req, res, next);
});

// Admin only routes
router.post('/', isAuthenticated, addProject);
router.put('/:id', isAuthenticated, updateProject);
router.delete('/:id', isAuthenticated, deleteProject);

export default router;

