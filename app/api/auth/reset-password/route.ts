import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token jest wymagany' }, { status: 400 });
    }

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ valid: false, error: 'Token jest nieprawidłowy lub wygasł' }, { status: 400 });
    }

    return NextResponse.json({ valid: true, email: user.email });
  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json({ error: 'Wystąpił błąd' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email i hasło są wymagane' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Hasło musi mieć minimum 6 znaków' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Użytkownik nie istnieje' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ 
      success: true, 
      email: user.email,
      message: 'Hasło zostało zmienione' 
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Wystąpił błąd' }, { status: 500 });
  }
}
