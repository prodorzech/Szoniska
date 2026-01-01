import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUpdates() {
  try {
    console.log('🌱 Seeding updates...');

    // Get first admin user
    const adminDiscordIds = process.env.ADMIN_DISCORD_IDS?.split(',') || [];
    const admin = await prisma.user.findFirst({
      where: {
        discordId: {
          in: adminDiscordIds,
        },
      },
    });

    if (!admin) {
      console.error('❌ No admin user found. Please set ADMIN_DISCORD_IDS in .env');
      return;
    }

    // Create sample updates
    const updates = [
      {
        version: '1.0.0',
        title: 'Uruchomienie platformy Szoniska',
        content: `Witamy na platformie Szoniska! 🎉

To pierwsza oficjalna wersja naszej platformy do dzielenia się najgorszymi szonami polskimi.

Funkcje:
- Dodawanie postów ze zdjęciami
- System komentarzy
- Panel administratora
- System ostrzeżeń
- Autoryzacja przez Discord i email

Miłego korzystania!`,
        isPinned: true,
        authorId: admin.id,
      },
      {
        version: '1.1.0',
        title: 'System aktualizacji',
        content: `Dodaliśmy nowy system aktualizacji! 

Teraz administratorzy mogą publikować informacje o nowych funkcjach, a użytkownicy mogą je przeglądać w swoim profilu.

Aktualizacje mogą być przypinane, aby wyróżnić najważniejsze ogłoszenia.`,
        isPinned: false,
        authorId: admin.id,
      },
    ];

    for (const update of updates) {
      await prisma.update.create({
        data: update,
      });
      console.log(`✅ Created update: ${update.title}`);
    }

    console.log('✅ Seeding updates completed!');
  } catch (error) {
    console.error('❌ Error seeding updates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUpdates();
