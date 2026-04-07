import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getProviders,
  getProviderById,
  updateProviderStatus,
  updateProviderLocation,
  getProviderDashboard
} from '../controllers/providerController.js';

const router = express.Router();

// Protected routes
router.get('/dashboard', authMiddleware, getProviderDashboard);
router.put('/status', authMiddleware, updateProviderStatus);
router.put('/location', authMiddleware, updateProviderLocation);

// Public routes (must be last to not catch /dashboard)
router.get('/', getProviders);
router.get('/:id', getProviderById);

export default router;
