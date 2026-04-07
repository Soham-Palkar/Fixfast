import Technician from '../models/Provider.js';
import Booking from '../models/Booking.js';

// ✅ UPDATE TECHNICIAN AVAILABILITY (MANUAL)
export const updateTechnicianAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const userId = req.user.userId;
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

    const technician = await Technician.findByIdAndUpdate(
      userId,
      { availability },
      { new: true }
    );

    res.json({
      message: 'Availability updated successfully',
      technician
    });

  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
