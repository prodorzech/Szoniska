import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET single update
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const update = await prisma.update.findUnique({
      where: { id: params.id },
    });

    if (!update) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error fetching update:', error);
    return NextResponse.json({ error: 'Failed to fetch update' }, { status: 500 });
  }
}

// PATCH update (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const update = await prisma.update.update({
      where: { id: params.id },
      data: {
        ...(version && { version }),
        ...(title && { title }),
        ...(content && { content }),
        ...(isPinned !== undefined && { isPinned }),
      },
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error updating update:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE update (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.update.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting update:', error);
    return NextResponse.json({ error: 'Failed to delete update' }, { status: 500 });
  }
}
