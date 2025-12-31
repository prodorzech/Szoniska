import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Endpoint do automatycznego czyszczenia całego chatu co 30 dni
// Można wywołać przez cron job lub scheduled task (np. codziennie sprawdza i co 30 dni czyści)
export async function GET() {
  try {
    // Pobierz najstarszą wiadomość aby sprawdzić czy minęło 30 dni
    const oldestMessage = await prisma.chatMessage.findFirst({
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!oldestMessage) {
      return NextResponse.json({
        success: true,
        message: 'Brak wiadomości do wyczyszczenia',
        count: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Jeśli najstarsza wiadomość jest starsza niż 30 dni, wyczyść CAŁY chat
    if (oldestMessage.createdAt < thirtyDaysAgo) {
      const result = await prisma.chatMessage.deleteMany({});

      return NextResponse.json({
        success: true,
        message: `Automatyczne czyszczenie: wyczyszczono cały chat (${result.count} wiadomości)`,
        count: result.count,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Nie minęło jeszcze 30 dni od pierwszej wiadomości',
      count: 0,
      daysRemaining: Math.ceil((oldestMessage.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000)),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Błąd automatycznego czyszczenia chatu:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Nie udało się wyczyścić czatu',
      },
      { status: 500 }
    );
  }
}
