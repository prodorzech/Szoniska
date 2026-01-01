import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: false, // Nie zwracaj emaila w publicznym profilu
        image: true,
        discordUsername: true,
        createdAt: true,
        isBlocked: true,
        isRestricted: true,
        restrictionReason: true,
        _count: {
          select: {
            posts: true,
            warnings: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Nie znaleziono użytkownika' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Wystąpił błąd' }, { status: 500 });
  }
}
