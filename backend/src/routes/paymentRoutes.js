import express from 'express';
import { simulatePayment, getTechnicianWallet } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/pay', authMiddleware, simulatePayment);
router.get('/wallet', authMiddleware, getTechnicianWallet);

export default router;
