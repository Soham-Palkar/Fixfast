import express from 'express';
import {
  userRegister,
  userLogin,
  providerRegister,
  providerLogin,
  getMe,
  updateProfile,
  verifyEmail,
  resendVerification
} from '../controllers/authController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// User routes
router.post('/user/register', userRegister);
router.post('/user/login', userLogin);

// Provider routes
router.post('/provider/register', 
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "aadhaarImage", maxCount: 1 }
  ]), 
  providerRegister
);
router.post('/provider/login', providerLogin);

// 🔥 NEW ROUTE
router.get('/me', authMiddleware, getMe);
router.put('/update', authMiddleware, updateProfile);

// Email Verification routes
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

export default router;