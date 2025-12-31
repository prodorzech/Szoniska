'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaExclamationTriangle, FaEye } from 'react-icons/fa';
import type { Post } from '@/types/post';

export default function VerificationPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      const res = await fetch('/api/admin/pending-posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId: string, withWarning: boolean = false) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warning: withWarning ? warningMessage : null,
        }),
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
        setSelectedPost(null);
        setWarningMessage('');
      }
    } catch (error) {
      console.error('Error approving post:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (postId: string) => {
    if (!confirm('Czy na pewno chcesz odrzucić ten post?')) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/reject`, {
        method: 'POST',
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error rejecting post:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
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

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-purple-500/20">
        <p className="text-gray-400 text-lg">Brak postów do weryfikacji</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20"
        >
          <div className="flex gap-6">
            {/* Podgląd */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {post.user.image ? (
                  <img
                    src={post.user.image}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                    {post.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{post.user.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('pl-PL')}
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">{post.title}</h3>
              <p className="text-gray-300 mb-4 whitespace-pre-wrap">{post.description}</p>

              {post.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${post.title} - ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(img, '_blank')}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Akcje */}
            <div className="w-64 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPreviewPost(post)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <FaEye />
                Podgląd
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleApprove(post.id)}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                <FaCheck />
                Zatwierdź
              </motion.button>

              <div className="space-y-2">
                <textarea
                  value={selectedPost?.id === post.id ? warningMessage : ''}
                  onChange={(e) => {
                    setSelectedPost(post);
                    setWarningMessage(e.target.value);
                  }}
                  placeholder="Wpisz ostrzeżenie (opcjonalnie)..."
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-yellow-500/30 focus:border-yellow-500 focus:outline-none resize-none text-sm"
                  rows={3}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleApprove(post.id, true)}
                  disabled={processing || !warningMessage}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  <FaExclamationTriangle />
                  Zatwierdź z ostrzeżeniem
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleReject(post.id)}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                <FaTimes />
                Odrzuć
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Modal podglądu posta */}
      <AnimatePresence>
        {previewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setPreviewPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-blue-500/30 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Podgląd posta</h2>
                <button
                  onClick={() => setPreviewPost(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Symulacja jak będzie wyglądał post */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-purple-500/20 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  {previewPost.user.image ? (
                    <img
                      src={previewPost.user.image}
                      alt={previewPost.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {previewPost.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white text-lg">{previewPost.user.name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(previewPost.createdAt).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">{previewPost.title}</h3>
                <p className="text-gray-300 mb-6 whitespace-pre-wrap leading-relaxed">
                  {previewPost.description}
                </p>

                {previewPost.images && previewPost.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {previewPost.images.map((img, idx) => (
                      <motion.img
                        key={idx}
                        src={img}
                        alt={`${previewPost.title} - ${idx + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      />
                    ))}
                  </div>
                )}

                {(previewPost.facebookUrl || previewPost.instagramUrl || previewPost.tiktokUrl) && (
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    {previewPost.facebookUrl && (
                      <span className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium">
                        Facebook
                      </span>
                    )}
                    {previewPost.instagramUrl && (
                      <span className="px-4 py-2 bg-pink-600/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm font-medium">
                        Instagram
                      </span>
                    )}
                    {previewPost.tiktokUrl && (
                      <span className="px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-lg text-white text-sm font-medium">
                        TikTok
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                <p className="text-blue-400 text-sm">
                  💡 Tak będzie wyglądał ten post po zatwierdzeniu na głównej stronie
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
