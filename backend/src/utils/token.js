import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for email verification
 * @param {string} userId - The user's ID
 * @param {string} userType - The user type ('user' or 'provider')
 * @returns {string} - The generated JWT token (expires in 1h)
 */
export const generateVerificationToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Verify an email verification token
 * @param {string} token - The token to verify
 * @returns {object} - The decoded payload
 */
export const verifyVerificationToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
