import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isAuthenticated, getMe);
router.put('/update/me', isAuthenticated, updateProfile);

router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

export default router;

