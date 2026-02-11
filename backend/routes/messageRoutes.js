import express from 'express';
import {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} from '../controllers/messageController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public contact form
router.post('/', createMessage);

// Admin
router.get('/', isAuthenticated, getMessages);
router.put('/:id/read', isAuthenticated, markAsRead);
router.delete('/:id', isAuthenticated, deleteMessage);

export default router;

