import Booking from '../models/Booking.js';
import Provider from '../models/Provider.js';
import Report from '../models/Report.js';
import { generateOTP } from './authController.js';
import { checkProviderPenalty } from '../utils/penaltyService.js';

// ✅ UPDATE TECHNICIAN AVAILABILITY HELPER
const updateTechnicianAvailability = async (providerId, availability) => {
  try {
    await Provider.findByIdAndUpdate(
      providerId,
      { availability },
      { new: true }
    );
    console.log(`Updated technician ${providerId} availability to: ${availability}`);
  } catch (error) {
    console.error('Error updating technician availability:', error);
  }
};

// ✅ DERIVE AVAILABILITY FROM ACTIVE BOOKINGS
const deriveAvailabilityFromBookings = async (providerId) => {
  try {
    const activeBookings = await Booking.find({
      providerId,
      status: { $in: ['accepted', 'otp verified'] }
    });
    
    return activeBookings.length > 0 ? 'busy' : 'available';
  } catch (error) {
    console.error('Error deriving availability:', error);
    return 'available';
  }
};

// ✅ UPDATE TECHNICIAN AVAILABILITY (MANUAL)
export const updateTechnicianAvailabilityStatus = async (req, res) => {
  try {
    const { availability } = req.body;
    const userId = req.user._id;
    const userType = req.user.userType;

    // Only providers can update their own availability
    if (userType !== 'provider') {
      return res.status(403).json({ message: 'Only providers can update availability' });
    }

    const validAvailability = ['available', 'busy', 'offline'];
    if (!validAvailability.includes(availability)) {
      return res.status(400).json({ message: 'Invalid availability status' });
    }

    // Check if provider has active bookings when trying to go offline/available
    if (availability === 'offline' || availability === 'available') {
      const activeBookings = await Booking.find({
        providerId: userId,
        status: { $in: ['accepted', 'otp verified'] }
      });

      if (activeBookings.length > 0 && availability === 'offline') {
        return res.status(400).json({ 
          message: 'Cannot go offline while having active bookings' 
        });
      }

      if (activeBookings.length > 0 && availability === 'available') {
        return res.status(400).json({ 
          message: 'Cannot set to available while having active bookings' 
        });
      }
    }

    const provider = await Provider.findByIdAndUpdate(
      userId,
      { availability },
      { new: true }
    );

    res.json({
      message: 'Availability updated successfully',
      availability: provider.availability
    });

  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET TECHNICIAN AVAILABILITY
export const getTechnicianAvailability = async (req, res) => {
  try {
    const { technicianId } = req.params;
    
    const provider = await Provider.findById(technicianId).select('availability');
    if (!provider) {
      return res.status(404).json({ message: 'Technician not found' });
    }

    // Derive real-time availability from bookings
    const realTimeAvailability = await deriveAvailabilityFromBookings(technicianId);
    
    res.json({
      availability: provider.availability,
      realTimeAvailability,
      message: 'Use realTimeAvailability for accurate status'
    });

  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ MARK ALL BOOKINGS AS SEEN BY TECHNICIAN (by technician ID)
export const markBookingsAsSeenByTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const userId = req.user.userId;
    const userType = req.user.userType;

    // Only providers can mark bookings as seen
    if (userType !== 'provider') {
      return res.status(403).json({ message: 'Only providers can mark bookings as seen' });
    }

    // Update all unseen bookings for this specific technician
    const result = await Booking.updateMany(
      { 
        providerId: technicianId,
        isSeenByTechnician: false 
      },
      { 
        isSeenByTechnician: true 
      }
    );

    res.json({ 
      message: 'All bookings marked as seen', 
      updatedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Mark bookings as seen error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ MARK ALL BOOKINGS AS SEEN BY TECHNICIAN
export const markAllBookingsAsSeen = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    // Only providers can mark bookings as seen
    if (userType !== 'provider') {
      return res.status(403).json({ message: 'Only providers can mark bookings as seen' });
    }

    // Update all unseen bookings for this provider
    const result = await Booking.updateMany(
      { 
        providerId: userId, 
        isSeenByTechnician: false 
      },
      { 
        isSeenByTechnician: true 
      }
    );

    res.json({ 
      message: 'All bookings marked as seen', 
      updatedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Mark all bookings as seen error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ MARK BOOKING AS SEEN BY TECHNICIAN
export const markBookingAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userType = req.user.userType;

    // Only providers can mark bookings as seen
    if (userType !== 'provider') {
      return res.status(403).json({ message: 'Only providers can mark bookings as seen' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if this booking belongs to the current provider
    if (booking.providerId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to mark this booking as seen' });
    }

    booking.isSeenByTechnician = true;
    await booking.save();

    res.json({ message: 'Booking marked as seen', booking });
  } catch (error) {
    console.error('Mark booking as seen error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { providerId, serviceName, price, userLocation } = req.body;
    const userId = req.user.userId;

    if (!providerId || !serviceName || !price || !userLocation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // ✅ CHECK TECHNICIAN AVAILABILITY
    if (provider.availability !== 'available') {
      return res.status(400).json({ 
        message: 'Technician not available for booking',
        availability: provider.availability 
      });
    }

    const otp = generateOTP();

    const booking = new Booking({
      userId,
      providerId,
      providerName: provider.fullName,
      serviceName,
      price,
      userLocation,
      otp
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
      otp
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET BOOKINGS (FIXED - NO QUERY PARAM BUG)
export const getBookings = async (req, res) => {
  try {
      const userId = req.user.userId;
      const userType = req.user.userType;

      let filter = {};

      if (userType === 'user') {
        filter.userId = userId;
      }

      if (userType === 'provider') {
        filter.providerId = userId;
      }

      const bookings = await Booking.find(filter)
        .populate('userId', 'fullName phone address')
        .populate('providerId', 'fullName phone')
        .sort({ createdAt: -1 });

    const safeBookings = bookings.map((b) => {
      const obj = b.toObject();

      // 🔥 Hide OTP from provider
      if (req.user.userType === 'provider') {
        delete obj.otp;
      }

      return obj;
    });

    res.json(safeBookings);

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    booking.otpVerified = true;
    booking.status = 'otp verified';
    await booking.save();

    res.json({
      message: 'OTP verified successfully',
      booking
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ UPDATE STATUS (ACCEPT / DECLINE / COMPLETE / CANCEL)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    const allowedStatus = ['pending', 'accepted', 'declined', 'otp verified', 'completed', 'cancelled'];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // 🔥 STRICT REQUIREMENT: Prevent Completion without OTP
    if (status === 'completed' && !booking.otpVerified) {
      return res.status(400).json({ message: 'OTP not verified' });
    }

    // 🔥 PREVENT CANCELLATION AFTER SERVICE STARTS
    if (status === 'cancelled' && (booking.otpVerified || booking.status === 'completed')) {
      return res.status(400).json({
        message: 'Cannot cancel after service has started'
      });
    }

    // Validate ownership
    if (req.user.userType === 'user') {
      if (booking.userId.toString() !== req.user.userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }
      // Users can only cancel
      if (status !== 'cancelled') {
        return res.status(400).json({ message: 'Users can only cancel bookings' });
      }
    } else if (req.user.userType === 'provider') {
      if (booking.providerId.toString() !== req.user.userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }
    }

    // Status transition logic
    const current = booking.status;
    let isValidTransition = false;

    if (current === 'pending') {
      isValidTransition = ['accepted', 'declined', 'cancelled'].includes(status);
    } else if (current === 'accepted') {
      isValidTransition = ['otp verified', 'cancelled'].includes(status);
    } else if (current === 'otp verified') {
      isValidTransition = ['completed'].includes(status);
    } else if (['completed', 'cancelled', 'declined'].includes(current)) {
      return res.status(400).json({ message: `Cannot change status from terminal state '${current}'` });
    }

    if (!isValidTransition && status !== current) {
      return res.status(400).json({ message: `Invalid transition from ${current} to ${status}` });
    }

    booking.status = status;
    await booking.save();

    // ✅ UPDATE TECHNICIAN AVAILABILITY BASED ON BOOKING STATUS
    if (status === 'accepted' || status === 'otp verified') {
      await updateTechnicianAvailability(booking.providerId, 'busy');
    } else if (['completed', 'cancelled', 'declined'].includes(status)) {
      await updateTechnicianAvailability(booking.providerId, 'available');
    }

    res.json({
      message: 'Status updated successfully',
      booking
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ UPDATE LOCATION (LIVE TRACKING)
export const updateBookingLocation = async (req, res) => {
  try {
    const { lat, lng, userType } = req.body;
    const bookingId = req.params.id;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Location required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (userType === 'provider') {
      booking.providerLocation = { lat, lng };
    } else {
      booking.userLocation = { lat, lng };
    }

    await booking.save();

    res.json({
      message: 'Location updated',
      booking
    });

  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ ADD REVIEW
export const addBookingReview = async (req, res) => {
  try {
    const { rating, feedback, report } = req.body;
    const bookingId = req.params.id;

    // Allow submission if either rating OR feedback OR report is provided
    if (!rating && !feedback && !report) {
      return res.status(400).json({ message: 'Please provide rating, feedback, or report' });
    }

    // Validate rating only if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // 🔥 NEW REQUIREMENT: COMPULSORY PAYMENT FOR FEEDBACK
    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ 
        message: 'Payment is compulsory before submitting feedback or reporting.' 
      });
    }

    booking.userRating = rating || null;
    booking.userFeedback = feedback || '';
    booking.userReport = report || '';
    await booking.save();

    // ✅ ADD REVIEW TO PROVIDER'S REVIEWS ARRAY
    if (rating) {
      const provider = await Provider.findById(booking.providerId);

      if (provider) {
        // Add new review to provider's reviews array
        provider.reviews.push({
          userId: booking.userId,
          rating,
          feedback
        });

        // ✅ CALCULATE RATING FROM ALL REVIEWS
        provider.rating = provider.reviews.length > 0
          ? provider.reviews.reduce((sum, r) => sum + r.rating, 0) / provider.reviews.length
          : 0;

        await provider.save();
      }
    }

    // ✅ AUTO-REPORT CREATION: Ensure report is visible to Admin
    if (report) {
      try {
        // Check if report already exists for this booking to avoid duplicates
        const existingReport = await Report.findOne({ booking: booking._id });
        
        if (!existingReport) {
          await Report.create({
            provider: booking.providerId,
            user: booking.userId,
            booking: booking._id,
            reason: 'Other', // Default for feedback-submitted reports
            description: report,
            status: 'pending'
          });

          // Also check for auto-ban penalty
          await checkProviderPenalty(booking.providerId);
        }
      } catch (reportError) {
        console.error('Error creating report / checking penalty:', reportError);
      }
    }

    res.json({
      message: feedback || report ? 'Feedback submitted successfully' : 'Rating submitted successfully',
      booking
    });

  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};