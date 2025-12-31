import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - pobierz wszystkie wiadomości (tylko admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Brak uprawnień' },
        { status: 403 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            discordUsername: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Błąd pobierania wiadomości:', error);
    return NextResponse.json(
      { error: 'Nie udało się pobrać wiadomości' },
      { status: 500 }
    );
  }
}

// POST - wyślij wiadomość (tylko admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Brak uprawnień' },
        { status: 403 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Treść wiadomości nie może być pusta' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Wiadomość jest za długa (max 1000 znaków)' },
        { status: 400 }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            discordUsername: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Błąd wysyłania wiadomości:', error);
    return NextResponse.json(
      { error: 'Nie udało się wysłać wiadomości' },
      { status: 500 }
    );
  }
}

// DELETE - wyczyść cały chat (tylko admin)
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Brak uprawnień' },
        { status: 403 }
      );
    }

    const result = await prisma.chatMessage.deleteMany({});

    return NextResponse.json({
      message: `Wyczyszczono cały chat (${result.count} wiadomości)`,
      count: result.count,
    });
  } catch (error) {
    console.error('Błąd czyszczenia czatu:', error);
    return NextResponse.json(
      { error: 'Nie udało się wyczyścić czatu' },
      { status: 500 }
    );
  }
}
