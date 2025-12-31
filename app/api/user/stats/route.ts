import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        createdAt: true,
        isBlocked: true,
        isRestricted: true,
      },
    });

    const postsCount = await prisma.post.count({
      where: { userId: session.user.id },
    });

    const approvedPosts = await prisma.post.count({
      where: {
        userId: session.user.id,
        status: 'APPROVED',
      },
    });

    const pendingPosts = await prisma.post.count({
      where: {
        userId: session.user.id,
        status: 'PENDING',
      },
    });

    const rejectedPosts = await prisma.post.count({
      where: {
        userId: session.user.id,
        status: 'REJECTED',
      },
    });

    return NextResponse.json({
      postsCount,
      approvedPosts,
      pendingPosts,
      rejectedPosts,
      createdAt: user?.createdAt,
      isBlocked: user?.isBlocked || false,
      isRestricted: user?.isRestricted || false,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
