import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Edycja ostrzeżenia posta
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; warningId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const updatedWarning = await prisma.postWarning.update({
      where: {
        id: params.warningId,
      },
      data: {
        message: message.trim(),
      },
    });

    return NextResponse.json(updatedWarning);
  } catch (error) {
    console.error('Error updating post warning:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Usunięcie ostrzeżenia posta
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; warningId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.postWarning.delete({
      where: {
        id: params.warningId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post warning:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
