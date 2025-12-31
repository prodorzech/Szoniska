import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
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
    const { warning } = body;

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
      },
    });

    if (warning) {
      await prisma.postWarning.create({
        data: {
          message: warning,
          postId: params.id,
        },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to approve post' }, { status: 500 });
  }
}
