import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedChat() {
  try {
    console.log('🌱 Seeding chat messages...');

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

    // Get all users for chat messages
    const users = await prisma.user.findMany({
      take: 5,
    });

    if (users.length === 0) {
      console.error('❌ No users found in database');
      return;
    }

    // Create sample chat messages
    const messages = [
      { userId: admin.id, content: 'Witamy na chacie Szoniska! 🎉' },
      { userId: users[0]?.id || admin.id, content: 'Cześć wszystkim!' },
      { userId: users[1]?.id || admin.id, content: 'Siema, fajnie tu macie' },
      { userId: admin.id, content: 'Dzięki! Mamy nadzieję że wam się spodoba 😊' },
      { userId: users[2]?.id || admin.id, content: 'Kiedy będzie możliwość dodawania video?' },
      { userId: admin.id, content: 'Już pracujemy nad kolejnymi funkcjami!' },
      { userId: users[3]?.id || admin.id, content: 'Super strona, pozdrawiam!' },
    ];

    for (const message of messages) {
      await prisma.chatMessage.create({
        data: message,
      });
      console.log(`✅ Created message from user: ${message.userId}`);
    }

    console.log('✅ Seeding chat messages completed!');
  } catch (error) {
    console.error('❌ Error seeding chat:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChat();
