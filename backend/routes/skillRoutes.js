import express from 'express';
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSkills);

router.post('/', isAuthenticated, addSkill);
router
  .route('/:id')
  .put(isAuthenticated, updateSkill)
  .delete(isAuthenticated, deleteSkill);

export default router;

