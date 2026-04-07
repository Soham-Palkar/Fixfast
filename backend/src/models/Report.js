import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    reason: {
      type: String,
      enum: ["Late", "Rude", "Fraud", "Overcharge", "Other"],
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'resolved', 'rejected'],
      default: 'pending'
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report; // ✅ THIS FIXES YOUR ERROR