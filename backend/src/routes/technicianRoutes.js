import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { updateTechnicianAvailability } from '../controllers/technicianController.js';

const router = express.Router();

// All technician routes are protected
router.use(authMiddleware);

// ✅ Update technician availability
router.put('/update-availability', updateTechnicianAvailability);

export default router;
