import mongoose from 'mongoose';

const technicianWalletSchema = new mongoose.Schema({
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
    unique: true
  },
  pendingAmount: {
    type: Number,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const TechnicianWallet = mongoose.model('TechnicianWallet', technicianWalletSchema);

export default TechnicianWallet;
