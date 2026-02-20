import express from 'express';
import { getResume, updateResume } from '../controllers/resumeController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getResume);
router.put('/', isAuthenticated, updateResume);

export default router;
