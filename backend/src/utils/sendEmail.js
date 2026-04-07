import nodemailer from 'nodemailer';

/**
 * Send a verification email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Verification token
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/verify-email/${token}`;
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: process.env.MAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Fixfast Support" <${process.env.MAIL_USER || 'support@fixfast.com'}>`,
    to: email,
    subject: 'Verify Your Email - Fixfast',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
        <h2 style="color: #10b981; text-align: center;">Welcome to Fixfast, ${name}!</h2>
        <p>Thank you for registering. To complete your signup and start using our services, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p>This link will expire in <strong>1 hour</strong>. If the button doesn't work, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #666; font-size: 14px;">${verificationUrl}</p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">If you did not create an account, please ignore this email.</p>
      </div>
    `,
  };

  try {
    // Demo Mode: Log link to console
    console.log('\n---------------------------------------');
    console.log('📧  EMAIL VERIFICATION LINK (DEMO MODE)');
    console.log(`To: ${email}`);
    console.log(`Link: ${verificationUrl}`);
    console.log('---------------------------------------\n');

    // Only attempt to send if credentials are provided
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
    } else {
      console.log('⚠️  Email credentials not configured. Verification email was NOT sent, but the link is available above.');
    }
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    // In demo mode, we still want the developer to see the link even if sending fails
  }
};
