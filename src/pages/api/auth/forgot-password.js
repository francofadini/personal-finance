import { connectToDatabase } from '@/lib/mongodb';
import { createTransport } from 'nodemailer';
import { randomBytes } from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    const { db } = await connectToDatabase();

    // Check if user exists
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to user
    await db.collection('users').updateOne(
      { _id: user._id },
      { : { resetToken, resetTokenExpiry } }
    );

    // Send email with reset link
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
