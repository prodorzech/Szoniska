import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    console.log('EDIT User - Session:', {
      hasSession: !!session,
      email: session?.user?.email,
      id: session?.user?.id,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    console.log('EDIT User - Admin:', {
      found: !!admin,
      email: admin?.email,
      id: admin?.id,
    });

    const isAdmin = admin && admin.email === 'orzech363@gmail.com';

    console.log('EDIT User - isAdmin:', isAdmin, 'admin.email:', admin?.email);

    if (!isAdmin) {
      return NextResponse.json({ 
        error: 'Brak uprawnień',
        debug: {
          sessionId: session.user?.id,
          adminFound: !!admin,
          adminEmail: admin?.email,
          expectedEmail: 'orzech363@gmail.com',
        }
      }, { status: 403 });
    }

    const { name, email, password } = await req.json();
    const userId = params.id;

    const updateData: any = {};

    // Sprawdź czy email jest unikalny (jeśli się zmienia)
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ error: 'Ten email jest już zajęty' }, { status: 400 });
      }

      updateData.email = email;
    }

    // Sprawdź długość nazwy użytkownika
    if (name) {
      if (name.length < 2 || name.length > 50) {
        return NextResponse.json({ error: 'Nazwa użytkownika musi mieć 2-50 znaków' }, { status: 400 });
      }
      updateData.name = name;
    }

    // Hashuj hasło jeśli zostało podane
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Hasło musi mieć minimum 6 znaków' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Aktualizuj użytkownika
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Wystąpił błąd' }, { status: 500 });
  }
}
