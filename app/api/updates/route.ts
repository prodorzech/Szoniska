import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET all updates
export async function GET() {
  try {
    const updates = await prisma.update.findMany({
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}

// POST create new update (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const adminDiscordIds = process.env.ADMIN_DISCORD_IDS?.split(',') || [];
    const isAdmin = user?.discordId && adminDiscordIds.includes(user.discordId);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const { version, title, content, isPinned } = await req.json();

    if (!version || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const update = await prisma.update.create({
      data: {
        version,
        title,
        content,
        isPinned: isPinned || false,
        authorId: user.id,
      },
    });

    return NextResponse.json(update, { status: 201 });
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json({ error: 'Failed to create update' }, { status: 500 });
  }
}
