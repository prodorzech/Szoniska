import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'UserId i kod są wymagane' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: 'Nie znaleziono użytkownika lub 2FA nie jest włączone' },
        { status: 404 }
      );
    }

    // Weryfikuj kod
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!verified) {
      return NextResponse.json(
        { error: 'Nieprawidłowy kod weryfikacyjny' },
        { status: 400 }
      );
    }

    // Stwórz tymczasowy token do zalogowania
    const tempToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5); // Ważny 5 minut

    await prisma.twoFactorLogin.create({
      data: {
        userId: user.id,
        token: tempToken,
        expires,
      },
    });

    return NextResponse.json({
      success: true,
      token: tempToken,
      userId: user.id,
    });
  } catch (error) {
    console.error('Błąd weryfikacji 2FA:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd' },
      { status: 500 }
    );
  }
}
