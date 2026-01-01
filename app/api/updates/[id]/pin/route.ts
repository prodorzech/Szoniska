import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PATCH toggle pin status (admin only)
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

    // Get current update
    const currentUpdate = await prisma.update.findUnique({
      where: { id: params.id },
    });

    if (!currentUpdate) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    // Toggle pin status
    const update = await prisma.update.update({
      where: { id: params.id },
      data: {
        isPinned: !currentUpdate.isPinned,
      },
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error toggling pin status:', error);
    return NextResponse.json({ error: 'Failed to toggle pin status' }, { status: 500 });
  }
}
