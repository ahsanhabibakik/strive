import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { emailService } from '@/lib/email/service';
import { logger } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we sent a reset link.' },
        { status: 200 }
      );
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${resetToken}`;

    // Send password reset email
    const emailResult = await emailService.sendPasswordReset(
      user.email,
      user.name,
      resetUrl
    );

    if (!emailResult.success) {
      logger.error('Failed to send password reset email', {
        error: emailResult.error,
        email: user.email
      });
      
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      );
    }

    logger.info('Password reset email sent', {
      email: user.email,
      resetToken
    });

    return NextResponse.json(
      { message: 'If an account with that email exists, we sent a reset link.' },
      { status: 200 }
    );

  } catch (error) {
    logger.error('Forgot password error', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}