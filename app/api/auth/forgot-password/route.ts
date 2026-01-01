import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email jest wymagany' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'Jeśli email istnieje w systemie, wyślemy link do resetowania hasła' 
      });
    }

    // Check if user has password (not OAuth only)
    if (!user.password) {
      return NextResponse.json({ 
        success: true, 
        message: 'Jeśli email istnieje w systemie, wyślemy link do resetowania hasła' 
      });
    }

    // Generate unique reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save token to database
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetTokenExpiry,
      },
    });

    // Send email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({ 
      success: true, 
      message: 'Jeśli email istnieje w systemie, wyślemy link do resetowania hasła' 
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json({ error: 'Wystąpił błąd' }, { status: 500 });
  }
}
