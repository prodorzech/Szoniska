import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Generowanie sekretu 2FA i QR code
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generuj sekret
    const secret = speakeasy.generateSecret({
      name: `Szoniska (${user.name || user.email})`,
      issuer: 'Szoniska',
    });

    // Generuj QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return NextResponse.json({
      secret: secret.base32,
      qrCode,
    });
  } catch (error) {
    console.error('Błąd generowania 2FA:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd' },
      { status: 500 }
    );
  }
}

// Weryfikacja kodu i włączenie 2FA
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token, secret, action } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'enable') {
      // Weryfikuj kod z nowego sekretu
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (!verified) {
        return NextResponse.json(
          { error: 'Nieprawidłowy kod weryfikacyjny' },
          { status: 400 }
        );
      }

      // Włącz 2FA
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorSecret: secret,
          twoFactorEnabled: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Weryfikacja dwuetapowa została włączona',
      });
    } else if (action === 'disable') {
      // Weryfikuj kod z istniejącego sekretu
      if (!user.twoFactorSecret) {
        return NextResponse.json(
          { error: '2FA nie jest włączone' },
          { status: 400 }
        );
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (!verified) {
        return NextResponse.json(
          { error: 'Nieprawidłowy kod weryfikacyjny' },
          { status: 400 }
        );
      }

      // Wyłącz 2FA
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorSecret: null,
          twoFactorEnabled: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Weryfikacja dwuetapowa została wyłączona',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Błąd 2FA:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd' },
      { status: 500 }
    );
  }
}
