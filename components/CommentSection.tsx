'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTrash, FaTimes } from 'react-icons/fa';
import type { Comment } from '@/types/post';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingComment, setDeletingComment] = useState<Comment | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingComment) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${deletingComment.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchComments();
        setDeletingComment(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Nie udało się usunąć komentarza');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Wystąpił błąd podczas usuwania komentarza');
    } finally {
      setDeleting(false);
    }
  };

  const canDeleteComment = (comment: Comment) => {
    if (!session?.user) return false;
    // Użytkownik może usunąć swój komentarz lub jeśli jest adminem
    return comment.userId === session.user.id || session.user.isAdmin;
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">
        Komentarze ({comments.length})
      </h3>

      {session && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Dodaj komentarz..."
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors"
              disabled={submitting}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPaperPlane />
              Wyślij
            </motion.button>
          </div>
        </form>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-gray-400 text-center py-4">Ładowanie komentarzy...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Brak komentarzy. Bądź pierwszy!</p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 bg-gray-800/50 p-4 rounded-lg border border-purple-500/20"
            >
              {comment.user.image ? (
                <img
                  src={comment.user.image}
                  alt={comment.user.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {comment.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{comment.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('pl-PL')}
                  </span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
              {canDeleteComment(comment) && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDeletingComment(comment)}
                  className="text-red-500 hover:text-red-400 transition-colors flex-shrink-0"
                  title="Usuń komentarz"
                >
                  <FaTrash />
                </motion.button>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Modal potwierdzenia usunięcia */}
      <AnimatePresence>
        {deletingComment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4"
            onClick={() => !deleting && setDeletingComment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-red-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Potwierdź usunięcie</h3>
                <button
                  onClick={() => setDeletingComment(null)}
                  disabled={deleting}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <p className="text-gray-300 mb-4">
                Czy na pewno chcesz usunąć ten komentarz? Tej operacji nie można cofnąć.
              </p>

              <div className="bg-gray-800 p-3 rounded-lg mb-6 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Komentarz:</p>
                <p className="text-white">{deletingComment.content}</p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeletingComment(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Anuluj
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Usuwanie...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Usuń
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
