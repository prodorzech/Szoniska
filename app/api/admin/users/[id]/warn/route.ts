import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const warning = await prisma.warning.create({
      data: {
        message,
        userId: params.id,
      },
    });

    // Pobierz liczbę ostrzeżeń użytkownika
    const warningsCount = await prisma.warning.count({
      where: { userId: params.id },
    });

    // Automatycznie zaktualizuj status użytkownika na podstawie liczby ostrzeżeń
    const updateData: { isRestricted?: boolean; isBlocked?: boolean } = {};
    
    if (warningsCount >= 8) {
      // 8+ ostrzeżeń = zablokowany
      updateData.isBlocked = true;
      updateData.isRestricted = true;
    } else if (warningsCount >= 4) {
      // 4-7 ostrzeżeń = ograniczony
      updateData.isRestricted = true;
      updateData.isBlocked = false;
    } else {
      // 0-3 ostrzeżenia = w porządku
      updateData.isRestricted = false;
      updateData.isBlocked = false;
    }

    await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({...warning, warningsCount, status: updateData});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create warning' }, { status: 500 });
  }
}
