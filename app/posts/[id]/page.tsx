'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaExclamationTriangle, FaTrash, FaFacebook, FaInstagram, FaTiktok, FaEdit } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import EditPostModal from '@/components/profile/EditPostModal';

interface Post {
  id: string;
  title: string;
  description: string;
  images?: string[];
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  warnings: Array<{
    id: string;
    message: string;
    createdAt: string;
  }>;
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        setError('Nie znaleziono posta');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas ładowania posta');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWarning = async (warningId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć to ostrzeżenie?')) return;

    try {
      const res = await fetch(`/api/admin/posts/${params.id}/warnings/${warningId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchPost();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Ładowanie...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">{error || 'Nie znaleziono posta'}</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
          >
            <FaArrowLeft className="inline mr-2" />
            Powrót
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
        >
          <FaArrowLeft />
          Powrót
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-purple-500/30 rounded-2xl p-8"
        >
          {/* Header with Edit Button */}
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">{post.title}</h1>
            {session?.user?.id === post.user.id && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditingPost(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
              >
                <FaEdit />
                Edytuj
              </motion.button>
            )}
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700">
            {post.user.image ? (
              <img
                src={post.user.image}
                alt={post.user.name}
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-lg font-bold border-2 border-purple-500">
                {post.user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-white font-semibold flex items-center gap-2">
                <FaUser className="text-purple-400" />
                {post.user.name}
              </p>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <FaCalendarAlt />
                {new Date(post.createdAt).toLocaleString('pl-PL')}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8">
            <p className="text-gray-300 whitespace-pre-wrap text-lg">{post.description}</p>
          </div>

          {/* Images Gallery */}
          {post.images && post.images.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative rounded-xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500 transition-colors"
                  >
                    <img
                      src={image}
                      alt={`${post.title} - zdjęcie ${index + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Social Media Links */}
          {(post.facebookUrl || post.instagramUrl || post.tiktokUrl) && (
            <div className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-purple-500/20">
              <h3 className="text-white font-semibold mb-4 text-lg">Linki do social media</h3>
              <div className="flex flex-wrap gap-3">
                {post.facebookUrl && (
                  <a
                    href={post.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
                  >
                    <FaFacebook size={20} />
                    Facebook
                  </a>
                )}
                {post.instagramUrl && (
                  <a
                    href={post.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition-colors"
                  >
                    <FaInstagram size={20} />
                    Instagram
                  </a>
                )}
                {post.tiktokUrl && (
                  <a
                    href={post.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 rounded-lg text-white font-semibold transition-colors border border-white/20"
                  >
                    <FaTiktok size={20} />
                    TikTok
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Warnings */}
          {post.warnings && post.warnings.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-900/30 to-red-900/30 border-2 border-yellow-500/50 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <FaExclamationTriangle className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-yellow-400 font-bold text-xl">
                    Ostrzeżenia Administratora
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Ten post otrzymał {post.warnings.length} {post.warnings.length === 1 ? 'ostrzeżenie' : 'ostrzeżeń'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {post.warnings.map((warning, index) => (
                  <motion.div
                    key={warning.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30 hover:border-yellow-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-yellow-500/20 rounded text-yellow-400 text-xs font-semibold">
                            Ostrzeżenie #{index + 1}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(warning.createdAt).toLocaleDateString('pl-PL', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-white text-base leading-relaxed">{warning.message}</p>
                      </div>
                      {session?.user && (
                        <button
                          onClick={() => handleDeleteWarning(warning.id)}
                          className="ml-4 p-2 hover:bg-red-600/30 rounded-lg transition-colors group"
                          title="Usuń ostrzeżenie"
                        >
                          <FaTrash className="text-red-400 group-hover:text-red-300" size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {editingPost && post && (
        <EditPostModal
          post={post as any}
          onClose={() => setEditingPost(false)}
          onSuccess={() => {
            setEditingPost(false);
            fetchPost();
          }}
        />
      )}
    </div>
  );
}
