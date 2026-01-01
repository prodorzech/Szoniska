import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function checkAdminPermissions() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { isAdmin: false, error: 'Brak autoryzacji', status: 401, user: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { isAdmin: false, error: 'Użytkownik nie znaleziony', status: 404, user: null };
  }

  // Sprawdź czy użytkownik jest adminem (przez email lub Discord ID)
  const isAdmin = user.email === 'orzech363@gmail.com' || user.discordId === '1144910054001225779';

  if (!isAdmin) {
    return { isAdmin: false, error: 'Brak uprawnień', status: 403, user };
  }

  return { isAdmin: true, error: null, status: 200, user };
}
