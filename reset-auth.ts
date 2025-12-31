import { prisma } from './lib/prisma.js';

async function resetAuth() {
  console.log('Usuwam wszystkich użytkowników i powiązane dane...');
  
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
}

resetAuth()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
