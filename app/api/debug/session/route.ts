import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Brak sesji' }, { status: 401 });
    }

    const user = session.user?.id ? await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        discordId: true,
      }
    }) : null;

    return NextResponse.json({
      session: {
        user: session.user,
      },
      dbUser: user,
      isAdmin: user?.email === 'orzech363@gmail.com',
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Błąd' }, { status: 500 });
  }
}
