import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { pin } = await req.json();

    if (pin) {
      // Sprawdź ile postów jest już przypiętych
      const pinnedCount = await prisma.post.count({
        where: { isPinned: true },
      });

      if (pinnedCount >= 4) {
        return NextResponse.json(
          { error: 'Możesz przypiąć maksymalnie 4 posty' },
          { status: 400 }
        );
      }

      // Przypnij post
      await prisma.post.update({
        where: { id: params.id },
        data: {
          isPinned: true,
          pinnedAt: new Date(),
        },
      });
    } else {
      // Odepnij post
      await prisma.post.update({
        where: { id: params.id },
        data: {
          isPinned: false,
          pinnedAt: null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error pinning post:', error);
    return NextResponse.json({ error: 'Failed to pin post' }, { status: 500 });
  }
}
