import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const warnings = await prisma.warning.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
      },
    });

    return NextResponse.json(warnings);
  } catch (error) {
    console.error('Error fetching warnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warnings' },
      { status: 500 }
    );
  }
}
