import Report from "../models/Report.js";
import Booking from "../models/Booking.js";
import { checkProviderPenalty } from "../utils/penaltyService.js";

export const createReport = async (req, res) => {
  try {
    const { providerId, bookingId, reason, description } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (["cancelled", "declined", "pending"].includes(booking.status)) {
      return res.status(400).json({
        message: "You can only report once the service has been accepted or completed.",
      });
    }

    const existing = await Report.findOne({
      provider: providerId,
      user: req.user._id,
      booking: bookingId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already reported" });
    }

    await Report.create({
      provider: providerId,
      user: req.user._id,
      booking: bookingId,
      reason,
      description,
    });

    await checkProviderPenalty(providerId);

    res.json({ message: "Report submitted" });

  } catch (err) {
    console.error('[ERROR] createReport:', err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('provider', 'fullName email')
      .populate('user', 'fullName email')
      .populate('booking', 'serviceName')
      .sort({ createdAt: -1 });
    
    console.log(`[DEBUG] Fetched ${reports.length} reports for admin: ${req.user.userId}`);
    res.json(reports);
  } catch (err) {
    console.error('[ERROR] getAllReports:', err);
    res.status(500).json({ message: "Server error" });
  }
};