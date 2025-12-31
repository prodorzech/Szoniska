const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAuth() {
  console.log('Usuwam wszystkich użytkowników i powiązane dane...');
  
  try {
    // Usuń wszystko w kolejności
    await prisma.postWarning.deleteMany({});
    await prisma.warning.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('✅ Wszystkie dane usunięte!');
    console.log('Możesz teraz zalogować się ponownie.');
  } catch (error) {
    console.error('Błąd:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAuth();
