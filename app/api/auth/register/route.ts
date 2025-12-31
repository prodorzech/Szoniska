import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();

    // Walidacja
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Hasło musi mieć minimum 6 znaków' },
        { status: 400 }
      );
    }

    if (name.length < 3 || name.length > 30) {
      return NextResponse.json(
        { error: 'Nick musi mieć od 3 do 30 znaków' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy adres email' },
        { status: 400 }
      );
    }

    // Sprawdź czy email już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ten adres email jest już zajęty' },
        { status: 400 }
      );
    }

    // Sprawdź czy nick już istnieje
    const existingName = await prisma.user.findFirst({
      where: { name },
    });

    if (existingName) {
      return NextResponse.json(
        { error: 'Ten nick jest już zajęty' },
        { status: 400 }
      );
    }

    // Hash hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Utwórz użytkownika (nieaktywnego)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerified: false,
      },
    });

    // Generuj token weryfikacyjny
    const token = generateVerificationCode();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Ważny 24h

    await prisma.verificationToken.create({
      data: {
        email,
        token,
        type: 'REGISTER',
        expires,
      },
    });

    // Wyślij email
    try {
      await sendVerificationEmail(email, token, name);
    } catch (emailError) {
      console.error('Błąd wysyłania emaila:', emailError);
      // Usuń użytkownika i token jeśli email się nie wysłał
      await prisma.user.delete({ where: { id: user.id } });
      await prisma.verificationToken.deleteMany({ where: { email } });
      
      return NextResponse.json(
        { error: 'Nie udało się wysłać emaila weryfikacyjnego. Spróbuj ponownie później.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Konto utworzone! Sprawdź swoją skrzynkę email aby potwierdzić adres.',
      email,
    });
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas rejestracji' },
      { status: 500 }
    );
  }
}
