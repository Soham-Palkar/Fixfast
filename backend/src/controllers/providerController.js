import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';

// Get all providers
export const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ isBanned: { $ne: true } })
      .select('-password -aadhaarNumber')
      .sort({ rating: -1 });

    // ✅ DEBUG: Log provider data with images
    providers.forEach((provider, index) => {
      console.log(`🔍 DEBUG - Provider ${index}:`, {
        _id: provider._id,
        fullName: provider.fullName,
        profilePhoto: provider.profilePhoto ? `${provider.profilePhoto.substring(0, 50)}...` : "EMPTY",
        aadhaarCard: provider.aadhaarCard ? `${provider.aadhaarCard.substring(0, 50)}...` : "EMPTY"
      });
    });

    res.json(providers);
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get provider by ID
export const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .select('-password -aadhaarNumber');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json(provider);
  } catch (error) {
    console.error('Get provider error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get provider dashboard stats
export const getProviderDashboard = async (req, res) => {
  try {
    const providerId = req.user.userId;
    
    const bookings = await Booking.find({ providerId });

    const totalRequests = bookings.length;
    const accepted = bookings.filter(b => b.status === "Accepted" || b.status === "Completed" || b.status === "OTP Verified").length;
    const declined = bookings.filter(b => b.status === "Declined").length;
    const cancelled = bookings.filter(b => b.status === "Cancelled").length;
    const completed = bookings.filter(b => b.status === "Completed").length;
    
    const reviewedToday = bookings.filter(b => typeof b.userRating === "number" && b.userRating > 0);
    const avgRating = reviewedToday.length > 0 
      ? (reviewedToday.reduce((sum, item) => sum + item.userRating, 0) / reviewedToday.length).toFixed(1)
      : "0.0";

    const feedbacks = bookings.filter(item => item.userFeedback);
    const reports = bookings.filter(item => item.userReport);

    res.json({
      totalRequests,
      accepted,
      declined,
      cancelled,
      completed,
      avgRating,
      totalReviews: reviewedToday.length,
      feedbacks,
      reports
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update provider status
export const updateProviderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log("Updating provider status to:", status); // Debug log

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Normalize status to lowercase and validate
    const normalizedStatus = status.toLowerCase();
    const validStatuses = ['available', 'busy', 'offline'];
    
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be: available, busy, or offline' 
      });
    }

    const provider = await Provider.findByIdAndUpdate(
      req.user.userId,
      { availability: normalizedStatus },
      { new: true }
    ).select('-password -aadhaarNumber');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    console.log("Provider status updated successfully:", normalizedStatus); // Debug log

    res.json({
      message: 'Status updated successfully',
      provider
    });
  } catch (error) {
    console.error('Update provider status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update provider location
export const updateProviderLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // This would typically update a separate location collection
    // For now, we'll just return success
    res.json({
      message: 'Location updated successfully',
      location: { lat, lng }
    });
  } catch (error) {
    console.error('Update provider location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
