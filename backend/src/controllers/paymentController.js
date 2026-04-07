import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import TechnicianWallet from "../models/TechnicianWallet.js";
import Provider from "../models/Provider.js";

export const simulatePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: "Booking must be completed before payment" });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment && existingPayment.status === 'paid') {
      return res.status(400).json({ message: "Payment already made" });
    }

    // Create Payment Record
    const transactionId = "TXN" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    await Payment.create({
      bookingId: booking._id,
      userId: booking.userId,
      technicianId: booking.providerId,
      amount: booking.price,
      status: 'paid',
      transactionId
    });

    // Update Booking status
    booking.paymentStatus = 'paid';
    await booking.save();

    // Update Technician Wallet
    let wallet = await TechnicianWallet.findOne({ technicianId: booking.providerId });
    if (!wallet) {
      wallet = new TechnicianWallet({ technicianId: booking.providerId });
    }

    wallet.pendingAmount += booking.price;
    await wallet.save();

    res.json({ message: "Payment Successful ✅", transactionId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTechnicianWallet = async (req, res) => {
  try {
    const technicianId = req.user._id;
    const wallet = await TechnicianWallet.findOne({ technicianId });
    const payments = await Payment.find({ technicianId }).sort({ createdAt: -1 });

    res.json({
      wallet: wallet || { pendingAmount: 0, paidAmount: 0, totalEarned: 0 },
      payments
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
