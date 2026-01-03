import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        warnings: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sprawdź blokady użytkownika
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isBlocked: true, isRestricted: true },
    });

    if (user?.isBlocked) {
      return NextResponse.json(
        { error: 'Twoje konto jest zablokowane. Nie możesz edytować postów.' },
        { status: 403 }
      );
    }

    if (user?.isRestricted) {
      return NextResponse.json(
        { error: 'Twoje konto ma ograniczenia. Nie możesz edytować postów.' },
        { status: 403 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post || post.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (post.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Can only edit approved posts' }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, images, videos, facebookUrl, instagramUrl, tiktokUrl } = body;

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        description,
        images: images || [],
        videos: videos || [],
        facebookUrl,
        instagramUrl,
        tiktokUrl,
        editedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post || post.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
