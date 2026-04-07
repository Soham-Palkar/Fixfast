import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Standard Mongoose Setup to find the ID
const userSchema = new mongoose.Schema({ email: String });
const User = mongoose.model('User', userSchema);

const test = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: "testuser5@example.com" });
  
  if (!user) {
    console.log("User not found");
    process.exit(1);
  }

  const token = jwt.sign(
    { userId: user._id.toString(), userType: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  console.log('Verification Token:', token);

  const res = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`);
  const data = await res.json();
  console.log('Verification Status:', res.status);
  console.log('Verification Data:', data);

  mongoose.disconnect();
};

test();
