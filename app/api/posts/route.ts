import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    
    // Sprawdź czy użytkownik jest zablokowany
    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isBlocked: true },
      });
      
      if (user?.isBlocked) {
        return NextResponse.json(
          { error: 'Twoje konto jest zablokowane. Nie możesz przeglądać postów.' },
          { status: 403 }
        );
      }
    }

    // Budowanie warunku wyszukiwania
    const whereCondition: any = {
      status: 'APPROVED',
    };

    if (search) {
      whereCondition.OR = [
        { title: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { discordId: { contains: search } } },
      ];
    }

    const posts = await prisma.post.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            name: true,
            image: true,
            discordId: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { pinnedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isBlocked: true, isRestricted: true },
    });

    if (user?.isBlocked) {
      return NextResponse.json(
        { error: 'Twoje konto jest zablokowane. Nie możesz tworzyć postów.' },
        { status: 403 }
      );
    }

    if (user?.isRestricted) {
      return NextResponse.json(
        { error: 'Twoje konto ma ograniczenia. Nie możesz tworzyć postów.' },
        { status: 403 }
      );
    }

    const userFull = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.isBlocked) {
      return NextResponse.json({ error: 'Account blocked' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, images, videos, facebookUrl, instagramUrl, tiktokUrl } = body;

    const post = await prisma.post.create({
      data: {
        title,
        description,
        images: images || [],
        videos: videos || [],
        facebookUrl,
        instagramUrl,
        tiktokUrl,
        userId: session.user.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
