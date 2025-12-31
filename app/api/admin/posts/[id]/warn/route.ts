import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sprawdź czy użytkownik jest adminem
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Pobierz post i dodaj ostrzeżenie
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Utwórz ostrzeżenie dla posta
    await prisma.postWarning.create({
      data: {
        postId: params.id,
        message: message.trim(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error warning post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
