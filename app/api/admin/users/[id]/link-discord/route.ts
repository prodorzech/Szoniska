import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Link Discord ID to traditional account
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { discordId } = await req.json();

    if (!discordId || typeof discordId !== 'string') {
      return NextResponse.json({ error: 'Discord ID is required' }, { status: 400 });
    }

    // Check if Discord ID is already linked to another user
    const existingUser = await prisma.user.findFirst({
      where: { discordId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ten Discord ID jest już połączony z innym kontem' },
        { status: 400 }
      );
    }

    // Update user with Discord ID
    await prisma.user.update({
      where: { id: params.id },
      data: { discordId },
    });

    // Generate Discord OAuth link with state parameter containing user ID
    const discordClientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/auth/callback/discord`);
    const state = Buffer.from(JSON.stringify({ linkUserId: params.id })).toString('base64');
    
    const authLink = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email&state=${state}`;

    return NextResponse.json({ 
      success: true, 
      authLink,
      message: 'Discord ID został dodany. Wyślij link użytkownikowi.' 
    });
  } catch (error) {
    console.error('Error linking Discord:', error);
    return NextResponse.json({ error: 'Failed to link Discord' }, { status: 500 });
  }
}
