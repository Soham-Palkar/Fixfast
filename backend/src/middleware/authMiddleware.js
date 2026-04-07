import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Provider from "../models/Provider.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account;

    if (decoded.userType === 'provider') {
      account = await Provider.findById(decoded.userId);
    } else {
      account = await User.findById(decoded.userId);
    }

    if (!account) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (
      decoded.userType === 'provider' &&
      account.isBanned &&
      account.banUntil
    ) {
      if (account.banUntil > new Date()) {
        return res.status(403).json({
          message: `Your account has been suspended due to multiple customer complaints. You are banned until ${account.banUntil.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
          banned: true,
          banUntil: account.banUntil
        });
      } else {
        // Ban expired — auto-unban
        account.isBanned = false;
        account.banUntil = null;
        await account.save();
      }
    }

    req.user = {
  _id: account._id,
  userId: account._id,
  userType: decoded.userType,
  role: account.role || 'user'
};
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};