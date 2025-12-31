import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Znajdź komentarz
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      include: {
        post: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Sprawdź czy użytkownik jest autorem komentarza, autorem posta lub adminem
    const isCommentAuthor = comment.userId === session.user.id;
    const isPostAuthor = comment.post.userId === session.user.id;
    const isAdmin = session.user.isAdmin === true;

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'Nie masz uprawnień do usunięcia tego komentarza' },
        { status: 403 }
      );
    }

    // Usuń komentarz
    await prisma.comment.delete({
      where: { id: params.commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
