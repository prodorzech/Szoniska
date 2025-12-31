import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const warning = await prisma.warning.update({
      where: { id: params.id },
      data: { message },
    });

    return NextResponse.json(warning);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update warning' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Pobierz ostrzeżenie aby znać userId
    const warning = await prisma.warning.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!warning) {
      return NextResponse.json({ error: 'Warning not found' }, { status: 404 });
    }

    // Usuń ostrzeżenie
    await prisma.warning.delete({
      where: { id: params.id },
    });

    // Pobierz aktualną liczbę ostrzeżeń użytkownika
    const warningsCount = await prisma.warning.count({
      where: { userId: warning.userId },
    });

    // Zaktualizuj status użytkownika
    const updateData: { isRestricted?: boolean; isBlocked?: boolean } = {};
    
    if (warningsCount >= 8) {
      updateData.isBlocked = true;
      updateData.isRestricted = true;
    } else if (warningsCount >= 4) {
      updateData.isRestricted = true;
      updateData.isBlocked = false;
    } else {
      updateData.isRestricted = false;
      updateData.isBlocked = false;
    }

    await prisma.user.update({
      where: { id: warning.userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, warningsCount, status: updateData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete warning' }, { status: 500 });
  }
}
