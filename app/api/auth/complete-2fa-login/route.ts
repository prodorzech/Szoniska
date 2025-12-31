import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token jest wymagany' }, { status: 400 });
    }

    // Znajdź i zweryfikuj token
    const twoFactorLogin = await prisma.twoFactorLogin.findUnique({
      where: { token },
    });

    if (!twoFactorLogin) {
      return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 400 });
    }

    // Sprawdź czy nie wygasł
    if (new Date() > twoFactorLogin.expires) {
      await prisma.twoFactorLogin.delete({ where: { id: twoFactorLogin.id } });
      return NextResponse.json({ error: 'Token wygasł' }, { status: 400 });
    }

    // Pobierz użytkownika
    const user = await prisma.user.findUnique({
      where: { id: twoFactorLogin.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 });
    }

    // Usuń użyty token
    await prisma.twoFactorLogin.delete({ where: { id: twoFactorLogin.id } });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    console.error('Błąd complete 2FA:', error);
    return NextResponse.json({ error: 'Wystąpił błąd' }, { status: 500 });
  }
}
