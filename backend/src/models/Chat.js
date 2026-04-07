import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  senderType: {
    type: String,
    enum: ['user', 'provider'],
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String, // We'll store Base64 here to avoid file uploads for now, or URLs
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
