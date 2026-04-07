import express from 'express';
import { 
  getAdminStats, 
  settlePayments, 
  banTechnician, 
  unbanTechnician,
  warnTechnician, 
  clearFlag, 
  getFlaggedTechnicians,
  getAllTransactions,
  getAllTechnicians
} from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

import { getAllReports } from '../controllers/reportController.js';

const router = express.Router();

// All routes here require admin access
router.use(authMiddleware, adminMiddleware);

router.get('/stats', getAdminStats);
router.post('/settle-payments', settlePayments);
router.post('/ban-technician', banTechnician);
router.post('/unban-technician', unbanTechnician);
router.post('/warn-technician', warnTechnician);
router.post('/clear-flag', clearFlag);
router.get('/flagged-technicians', getFlaggedTechnicians);
router.get('/transactions', getAllTransactions);
router.get('/technicians', getAllTechnicians);
router.get('/reports', getAllReports);

export default router;
