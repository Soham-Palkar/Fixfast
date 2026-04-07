import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getBookings,
  verifyOTP,
  updateBookingStatus,
  updateBookingLocation,
  addBookingReview,
  markBookingAsSeen,
  markAllBookingsAsSeen,
  markBookingsAsSeenByTechnician,
  updateTechnicianAvailabilityStatus,
  getTechnicianAvailability
} from '../controllers/bookingController.js';

const router = express.Router();

// All booking routes are protected
router.use(authMiddleware);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/my', getBookings);
router.get('/provider', getBookings);
router.post('/verify', verifyOTP);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/location', updateBookingLocation);
router.put('/:id/review', addBookingReview);
router.put('/:id/mark-seen', markBookingAsSeen);
router.put('/mark-all-seen', markAllBookingsAsSeen);
router.put('/mark-seen/:technicianId', markBookingsAsSeenByTechnician);

// Availability endpoints
router.put('/availability', updateTechnicianAvailabilityStatus);
router.get('/availability/:technicianId', getTechnicianAvailability);

export default router;
