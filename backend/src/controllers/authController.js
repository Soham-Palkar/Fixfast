import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import { generateVerificationToken, verifyVerificationToken } from '../utils/token.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// User Registration
export const userRegister = async (req, res) => {
  try {
    const { fullName, email, phone, city, pincode, address, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      fullName,
      email,
      phone,
      city,
      pincode,
      address,
      password: hashedPassword
    });

    await user.save();

    // Generate Verification Token
    const verificationToken = generateVerificationToken(user._id, 'user');
    
    // Send Verification Email
    await sendVerificationEmail(user.email, user.fullName, verificationToken);

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in',
        notVerified: true,
        email: user.email
      });
    }

    // Generate token
    const token = generateToken(user._id, 'user');

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        pincode: user.pincode,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Provider Registration
export const providerRegister = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      gender,
      yearsOfExperience,
      address,
      city,
      pincode,
      serviceArea,
      aadhaarNumber,
      services,
      password,
      profilePhoto, // ✅ ADD: Base64 image
      aadhaarCard   // ✅ ADD: Base64 image
    } = req.body;

    // ✅ DEBUG: Log received images
    console.log("🔍 DEBUG - Received profilePhoto:", profilePhoto ? `${profilePhoto.substring(0, 50)}...` : "NOT RECEIVED");
    console.log("🔍 DEBUG - Received aadhaarCard:", aadhaarCard ? `${aadhaarCard.substring(0, 50)}...` : "NOT RECEIVED");

    // Check if provider already exists
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ message: 'Provider already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare provider data
    const providerData = {
      fullName,
      email,
      phone,
      gender,
      yearsOfExperience,
      address,
      city,
      pincode,
      serviceArea,
      aadhaarNumber,
      services,
      password: hashedPassword,
      profilePhoto, // ✅ FIX: Use correct field name
      aadhaarCard   // ✅ FIX: Use correct field name
    };

    // Add image paths if files were uploaded (legacy support)
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      providerData.profilePhoto = `/uploads/${req.files.profileImage[0].filename}`;
    }

    if (req.files && req.files.aadhaarImage && req.files.aadhaarImage[0]) {
      providerData.aadhaarCard = `/uploads/${req.files.aadhaarImage[0].filename}`;
    }

    // ✅ DEBUG: Log final data
    console.log("🔍 DEBUG - Final providerData.profilePhoto:", providerData.profilePhoto ? `${providerData.profilePhoto.substring(0, 50)}...` : "EMPTY");
    console.log("🔍 DEBUG - Final providerData.aadhaarCard:", providerData.aadhaarCard ? `${providerData.aadhaarCard.substring(0, 50)}...` : "EMPTY");

    // Create provider
    const provider = new Provider(providerData);
    await provider.save();

    // Generate Verification Token
    const verificationToken = generateVerificationToken(provider._id, 'provider');
    
    // Send Verification Email
    await sendVerificationEmail(provider.email, provider.fullName, verificationToken);

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true,
      provider: {
        id: provider._id,
        fullName: provider.fullName,
        email: provider.email,
        status: provider.status
      }
    });
  } catch (error) {
    console.error('Provider registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Provider Login
export const providerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find provider
    const provider = await Provider.findOne({ email });
    if (!provider) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check verification
    if (!provider.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in',
        notVerified: true,
        email: provider.email
      });
    }

    // Check if provider is banned
    if (provider.isBanned && provider.banUntil) {
      if (provider.banUntil > new Date()) {
        return res.status(403).json({
          message: `Your account has been suspended due to multiple customer complaints. You are banned until ${provider.banUntil.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
          banned: true,
          banUntil: provider.banUntil
        });
      } else {
        // Ban expired — auto-unban
        provider.isBanned = false;
        provider.banUntil = null;
        provider.availability = 'available';
        await provider.save();
      }
    }

    // Generate token
    const token = generateToken(provider._id, 'provider');

    res.json({
      message: 'Login successful',
      token,
      provider: {
        id: provider._id,
        fullName: provider.fullName,
        email: provider.email,
        phone: provider.phone,
        gender: provider.gender,
        yearsOfExperience: provider.yearsOfExperience,
        address: provider.address,
        city: provider.city,
        pincode: provider.pincode,
        serviceArea: provider.serviceArea,
        services: provider.services,
        status: provider.status,
        rating: provider.rating
      }
    });
  } catch (error) {
    console.error('Provider login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    let user;

    if (userType === "user") {
      user = await User.findById(userId).select("-password");
    } else {
      user = await Provider.findById(userId).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userObj = user.toObject();
    userObj.id = userObj._id;
    // delete userObj._id; // keeping _id just in case some other parts rely on it

    res.json({ user: userObj });

  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;
    const updateData = req.body;

    // ✅ DEBUG: Log received update data
    console.log("🔍 DEBUG - Update Profile - User Type:", userType);
    console.log("🔍 DEBUG - Update Profile - Received profilePhoto:", updateData.profilePhoto ? `${updateData.profilePhoto.substring(0, 50)}...` : "NOT RECEIVED");
    console.log("🔍 DEBUG - Update Profile - Received aadhaarCard:", updateData.aadhaarCard ? `${updateData.aadhaarCard.substring(0, 50)}...` : "NOT RECEIVED");

    // Remove sensitive fields
    delete updateData.password;
    delete updateData.email;

    let user;
    if (userType === "user") {
      user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    } else {
      user = await Provider.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ DEBUG: Log saved data
    console.log("🔍 DEBUG - Update Profile - Saved profilePhoto:", user.profilePhoto ? `${user.profilePhoto.substring(0, 50)}...` : "EMPTY");
    console.log("🔍 DEBUG - Update Profile - Saved aadhaarCard:", user.aadhaarCard ? `${user.aadhaarCard.substring(0, 50)}...` : "EMPTY");

    const userObj = user.toObject();
    userObj.id = userObj._id;

    res.json({ message: "Profile updated successfully", user: userObj });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = verifyVerificationToken(token);
    if (!decoded) {
      return res.status(400).json({ message: 'Invalid or expired verification token. Please request a new one.' });
    }

    const { userId, userType } = decoded;
    let user;

    if (userType === 'user') {
      user = await User.findById(userId);
    } else {
      user = await Provider.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'Email is already verified. You can now log in.' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend Verification
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check both collections
    let user = await User.findOne({ email });
    let userType = 'user';

    if (!user) {
      user = await Provider.findOne({ email });
      userType = 'provider';
    }

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This email is already verified' });
    }

    // Generate new token
    const token = generateVerificationToken(user._id, userType);
    
    // Send email
    await sendVerificationEmail(user.email, user.fullName, token);

    res.status(200).json({ message: 'Verification email has been resent. Please check your inbox.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};