import { connectToDatabase } from '@/lib/mongoose';
import { createTransport } from 'nodemailer';
import { randomBytes } from 'crypto';
import User from '@/backend/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const { email } = req.body;

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    await User.updateOne(
      { _id: user._id },
      { resetToken, resetTokenExpiry }
    );

    const transporter = createTransport({
      // Configure your email service here
    });

    await transporter.sendMail({
      to: user.email,
      from: 'noreply@yourapp.com',
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}">link</a> to set a new password.</p>
      `,
    });

    res.status(200).json({ message: 'Reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing request' });
  }
}
