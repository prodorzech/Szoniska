import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token jest wymagany' },
        { status: 400 }
      );
    }

    // Znajdź token weryfikacyjny
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Nieprawidłowy kod weryfikacyjny' },
        { status: 400 }
      );
    }

    // Sprawdź czy token nie wygasł
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json(
        { error: 'Kod weryfikacyjny wygasł. Zarejestruj się ponownie.' },
        { status: 400 }
      );
    }

    // Sprawdź czy email się zgadza (jeśli podano)
    if (email && verificationToken.email !== email) {
      return NextResponse.json(
        { error: 'Nieprawidłowy adres email' },
        { status: 400 }
      );
    }

    // Aktywuj konto
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: true },
    });

    // Usuń token
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({
      success: true,
      message: 'Email został potwierdzony! Możesz się teraz zalogować.',
    });
  } catch (error) {
    console.error('Błąd weryfikacji:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas weryfikacji' },
      { status: 500 }
    );
  }
}
