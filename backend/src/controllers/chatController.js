import Chat from '../models/Chat.js';
import Booking from '../models/Booking.js';

// ✅ GET UNREAD COUNT
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    // Find all bookings where user is involved
    const bookings = await Booking.find({
      [userType === 'user' ? 'userId' : 'providerId']: userId
    });

    const bookingIds = bookings.map(b => b._id);

    // Count unread messages from opposite sender type
    const oppositeSenderType = userType === 'user' ? 'provider' : 'user';
    
    const unreadCount = await Chat.countDocuments({
      bookingId: { $in: bookingIds },
      senderType: oppositeSenderType,
      isRead: false
    });

    res.json({ count: unreadCount });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ MARK MESSAGES AS READ
export const markMessagesAsRead = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;
    const userType = req.user.userType;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Validate ownership
    if (userType === 'user' && booking.userId.toString() !== userId.toString()) {
       return res.status(403).json({ message: 'Not authorized' });
    } else if (userType === 'provider' && booking.providerId.toString() !== userId.toString()) {
       return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark all unread messages as read for the opposite sender
    const oppositeSenderType = userType === 'user' ? 'provider' : 'user';
    
    await Chat.updateMany(
      { 
        bookingId, 
        senderType: oppositeSenderType, 
        isRead: false 
      },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });

  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getChats = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Validate ownership
    if (req.user.userType === 'user' && booking.userId.toString() !== req.user.userId.toString()) {
       return res.status(403).json({ message: 'Not authorized' });
    } else if (req.user.userType === 'provider' && booking.providerId.toString() !== req.user.userId.toString()) {
       return res.status(403).json({ message: 'Not authorized' });
    }

    const chats = await Chat.find({ bookingId }).sort({ createdAt: 1 });
    res.json(chats);

  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendChat = async (req, res) => {
  try {
    const { bookingId, message, image } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Validate ownership
    if (req.user.userType === 'user' && booking.userId.toString() !== req.user.userId.toString()) {
       return res.status(403).json({ message: 'Not authorized' });
    } else if (req.user.userType === 'provider' && booking.providerId.toString() !== req.user.userId.toString()) {
       return res.status(403).json({ message: 'Not authorized' });
    }

    const chat = new Chat({
      bookingId,
      senderId: req.user.userId,
      senderType: req.user.userType,
      message: message || '',
      imageUrl: image || ''
    });

    await chat.save();
    
    res.status(201).json(chat);
  } catch (error) {
    console.error('Send chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
