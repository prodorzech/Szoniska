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

    if (!session?.user) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const isAdmin = admin && admin.email === 'orzech363@gmail.com';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    const postId = params.id;

    // Usuń post i wszystkie powiązane dane
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: 'Post został usunięty' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Wystąpił błąd' }, { status: 500 });
  }
}
