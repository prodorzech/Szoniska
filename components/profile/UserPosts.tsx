'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CreatePostModal from './CreatePostModal';
import EditPostModal from './EditPostModal';
import type { Post } from '@/types/post';

export default function UserPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [userStatus, setUserStatus] = useState<{ isBlocked: boolean; isRestricted: boolean } | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchUserStatus();
  }, []);

  const fetchUserStatus = async () => {
    try {
      const res = await fetch('/api/user/stats');
      if (res.ok) {
        const data = await res.json();
        setUserStatus({
          isBlocked: data.isBlocked,
          isRestricted: data.isRestricted,
        });
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/user/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletingPost(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getStatusBadge = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    const styles = {
      PENDING: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
      APPROVED: 'bg-green-600/20 text-green-400 border-green-500/30',
      REJECTED: 'bg-red-600/20 text-red-400 border-red-500/30',
    };

    const labels = {
      PENDING: 'Weryfikowanie',
      APPROVED: 'Zweryfikowany',
      REJECTED: 'Odrzucony',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading || statusLoading) {
    return (
      <div className="flex justify-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Moje posty</h2>
        {!userStatus?.isBlocked && !userStatus?.isRestricted && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/50 transition-all"
          >
            <FaPlus />
            Utwórz post
          </motion.button>
        )}
      </div>

      {(userStatus?.isBlocked || userStatus?.isRestricted) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl border-2 ${
            userStatus.isBlocked
              ? 'bg-red-900/20 border-red-500/50'
              : 'bg-orange-900/20 border-orange-500/50'
          }`}
        >
          <p className={`font-semibold ${
            userStatus.isBlocked ? 'text-red-400' : 'text-orange-400'
          }`}>
            {userStatus.isBlocked
              ? '⚠️ Twoje konto jest zablokowane. Nie możesz tworzyć ani edytować postów.'
              : '⚠️ Twoje konto ma ograniczenia. Nie możesz tworzyć ani edytować postów.'}
          </p>
        </motion.div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-purple-500/20">
          <p className="text-gray-400 mb-4">Nie masz jeszcze żadnych postów</p>
          <p className="text-sm text-gray-500">Kliknij "Utwórz post" aby dodać pierwszy post</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{post.title}</h3>
                    {post.status && getStatusBadge(post.status)}
                  </div>
                  <p className="text-gray-400 line-clamp-2">{post.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Utworzono: {new Date(post.createdAt).toLocaleDateString('pl-PL')}</span>
                    {post.editedAt && (
                      <span>Edytowano: {new Date(post.editedAt).toLocaleDateString('pl-PL')}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {post.status === 'APPROVED' && !userStatus?.isBlocked && !userStatus?.isRestricted && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingPost(post)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="Edytuj"
                    >
                      <FaEdit size={18} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDeletingPost(post)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Usuń"
                  >
                    <FaTrash size={18} />
                  </motion.button>
                </div>
              </div>

              {post.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {post.images.slice(0, 3).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${post.title} - ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ))}
                  {post.images.length > 3 && (
                    <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                      +{post.images.length - 3}
                    </div>
                  )}
                </div>
              )}

              {post.warnings && post.warnings.length > 0 && (
                <div className="mt-4 space-y-2">
                  {post.warnings.map((warning) => (
                    <div
                      key={warning.id}
                      className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3"
                    >
                      <p className="text-yellow-400 text-sm font-semibold mb-1">⚠️ Ostrzeżenie</p>
                      <p className="text-gray-300 text-sm">{warning.message}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(warning.createdAt).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchPosts();
          }}
        />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSuccess={() => {
            setEditingPost(null);
            fetchPosts();
          }}
        />
      )}

      {/* Modal potwierdzenia usunięcia */}
      <AnimatePresence>
        {deletingPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setDeletingPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full border border-red-500/30 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <FaTrash size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Potwierdź usunięcie</h3>
                  <p className="text-gray-400 text-sm">Ta operacja jest nieodwracalna</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
                <p className="text-white font-semibold mb-1">{deletingPost.title}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{deletingPost.description}</p>
              </div>

              <p className="text-gray-300 mb-6">
                Czy na pewno chcesz usunąć ten post? Wszystkie dane, w tym zdjęcia i komentarze, zostaną trwale usunięte.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(deletingPost.id)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Usuń post
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeletingPost(null)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Anuluj
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
