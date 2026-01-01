import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!admin || admin.email !== 'orzech363@gmail.com') {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    const userId = params.id;

    // Nie pozwól adminowi usunąć samego siebie
    if (userId === admin.id) {
      return NextResponse.json({ error: 'Nie możesz usunąć swojego konta' }, { status: 400 });
    }

    // Usuń użytkownika i wszystkie powiązane dane (dzięki cascading delete w Prisma)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'Użytkownik został usunięty' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Wystąpił błąd podczas usuwania użytkownika' }, { status: 500 });
  }
}
