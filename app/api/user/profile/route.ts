import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Update user profile (name)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Nazwa musi mieć minimum 2 znaki' }, { status: 400 });
    }

    if (name.trim().length > 50) {
      return NextResponse.json({ error: 'Nazwa może mieć maksymalnie 50 znaków' }, { status: 400 });
    }

    // Check if user exists and get nameChangedAt
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { nameChangedAt: true, name: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if name change is allowed (7 days cooldown)
    if (existingUser.nameChangedAt) {
      const daysSinceLastChange = Math.floor(
        (Date.now() - new Date(existingUser.nameChangedAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastChange < 7) {
        const daysRemaining = 7 - daysSinceLastChange;
        return NextResponse.json(
          { error: `Możesz zmienić nazwę ponownie za ${daysRemaining} dni` },
          { status: 429 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        name: name.trim(),
        nameChangedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, name: user.name });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
