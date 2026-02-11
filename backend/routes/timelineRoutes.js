import express from 'express';
import {
  getTimeline,
  addTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from '../controllers/timelineController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTimeline);

router.post('/', isAuthenticated, addTimelineItem);
router
  .route('/:id')
  .put(isAuthenticated, updateTimelineItem)
  .delete(isAuthenticated, deleteTimelineItem);

export default router;

