import Provider from "../models/Provider.js";
import Payment from "../models/Payment.js";
import TechnicianWallet from "../models/TechnicianWallet.js";
import Report from "../models/Report.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalPayments = await Payment.find({ status: { $in: ['paid', 'settled'] } });
    const totalRevenue = totalPayments.reduce((acc, curr) => acc + curr.amount, 0);
    
    const pendingSettlements = await TechnicianWallet.aggregate([
      { $group: { _id: null, total: { $sum: "$pendingAmount" } } }
    ]);

    const flaggedTechnicians = await Provider.countDocuments({ status: 'flagged' });
    const activeTechnicians = await Provider.countDocuments({ status: 'active' });
    const bannedTechnicians = await Provider.countDocuments({ status: 'banned' });

    const totalPaidToTechs = await TechnicianWallet.aggregate([
      { $group: { _id: null, total: { $sum: "$paidAmount" } } }
    ]);

    const settledPaymentsSum = await Payment.aggregate([
      { $match: { status: 'settled' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalProfit = (settledPaymentsSum[0]?.total || 0) - (totalPaidToTechs[0]?.total || 0);

    res.json({
      totalRevenue,
      totalProfit,
      totalPayments: totalPayments.length,
      pendingSettlements: pendingSettlements[0]?.total || 0,
      flaggedTechnicians,
      activeTechnicians,
      bannedTechnicians
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const settlePayments = async (req, res) => {
  try {
    const wallets = await TechnicianWallet.find({ pendingAmount: { $gt: 0 } }).populate('technicianId');
    
    for (const wallet of wallets) {
      const technician = wallet.technicianId;
      if (!technician) continue;

      const rating = technician.rating;
      let share = 0.6; // Default 60%

      if (rating >= 4.5) {
        share = 0.9;
      } else if (rating >= 3) {
        share = 0.75;
      }

      const payout = wallet.pendingAmount * share;
      
      // Update wallet
      wallet.paidAmount += payout;
      wallet.totalEarned += payout;
      wallet.pendingAmount = 0;
      await wallet.save();

      // Update associated payments to 'settled'
      await Payment.updateMany(
        { technicianId: technician._id, status: 'paid' },
        { status: 'settled' }
      );
    }

    res.json({ message: "Settlements processed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const banTechnician = async (req, res) => {
  try {
    const { technicianId, days } = req.body;
    const banUntil = new Date();
    banUntil.setDate(banUntil.getDate() + parseInt(days));

    await Provider.findByIdAndUpdate(technicianId, {
      status: 'banned',
      isBanned: true,
      banUntil,
      availability: 'offline'
    });

    res.json({ message: `Technician banned for ${days} days` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const warnTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    const provider = await Provider.findById(technicianId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    provider.warningCount += 1;
    
    // Logic: Auto-ban for 30 days if warnings reach 5
    if (provider.warningCount >= 5 && provider.status !== 'banned') {
       provider.status = 'banned';
       provider.isBanned = true;
       provider.banUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
       provider.availability = 'offline';
       await provider.save();
       return res.json({ message: "Technician reached 5 warnings and was automatically banned for 30 days." });
    }

    await provider.save();
    res.json({ message: `Warning sent. Total warnings: ${provider.warningCount}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const unbanTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    await Provider.findByIdAndUpdate(technicianId, {
      status: 'active',
      isBanned: false,
      banUntil: null,
      availability: 'available'
    });
    res.json({ message: "Technician unbanned and set to active" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearFlag = async (req, res) => {
  try {
    const { technicianId } = req.body;
    await Provider.findByIdAndUpdate(technicianId, {
      status: 'active',
      complaintCount: 0
    });
    res.json({ message: "Flag cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFlaggedTechnicians = async (req, res) => {
  try {
    const flagged = await Provider.find({ status: 'flagged' });
    res.json(flagged);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'fullName email')
      .populate('technicianId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTechnicians = async (req, res) => {
  try {
    const techs = await Provider.find().select("-password");
    res.json(techs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
