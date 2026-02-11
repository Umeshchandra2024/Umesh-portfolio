import express from 'express';
import {
  getSoftwareApps,
  addSoftwareApp,
  updateSoftwareApp,
  deleteSoftwareApp,
} from '../controllers/softwareApplicationController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSoftwareApps);

router.post('/', isAuthenticated, addSoftwareApp);
router
  .route('/:id')
  .put(isAuthenticated, updateSoftwareApp)
  .delete(isAuthenticated, deleteSoftwareApp);

export default router;

