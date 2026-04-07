import express from 'express';
import { getChats, sendChat, markMessagesAsRead, getUnreadCount } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/chat/unread-count
router.get('/unread-count', getUnreadCount);

// GET /api/chat/:bookingId
router.get('/:bookingId', getChats);

// POST /api/chat/send
router.post('/send', sendChat);

// PUT /api/chat/:bookingId/mark-read
router.put('/:bookingId/mark-read', markMessagesAsRead);

export default router;
