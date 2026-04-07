import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  serviceArea: {
    type: String,
    required: true,
    trim: true
  },
  aadhaarNumber: {
    type: String,
    required: true,
    trim: true
  },
  aadhaarCard: {
    type: String,
    default: ''
  },
  services: [{
    type: String,
    required: true,
    trim: true
  }],
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  availability: {
    type: String,
    required: true,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  status: {
    type: String,
    enum: ['active', 'flagged', 'banned'],
    default: 'active'
  },
  complaintCount: {
    type: Number,
    default: 0
  },
  warningCount: {
    type: Number,
    default: 0
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banUntil: {
    type: Date,
    default: null
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Provider = mongoose.model('Provider', providerSchema);

export default Provider;
