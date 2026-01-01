'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaExclamationTriangle, FaTrash, FaEdit } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  postWarnings: Array<{
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
          {/* Header */}
          <h1 className="text-3xl font-bold text-white mb-6">{post.title}</h1>

          {/* Author Info */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700">
            {post.author.image ? (
              <img
                src={post.author.image}
                alt={post.author.name}
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-lg font-bold border-2 border-purple-500">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-white font-semibold flex items-center gap-2">
                <FaUser className="text-purple-400" />
                {post.author.name}
              </p>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <FaCalendarAlt />
                {new Date(post.createdAt).toLocaleString('pl-PL')}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Warnings */}
          {post.postWarnings && post.postWarnings.length > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-yellow-400 font-semibold mb-4 flex items-center gap-2">
                <FaExclamationTriangle />
                Ostrzeżenia administratora ({post.postWarnings.length})
              </h3>
              <div className="space-y-3">
                {post.postWarnings.map((warning) => (
                  <div key={warning.id} className="bg-gray-800/50 rounded-lg p-4 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white">{warning.message}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(warning.createdAt).toLocaleString('pl-PL')}
                      </p>
                    </div>
                    {session?.user && (
                      <button
                        onClick={() => handleDeleteWarning(warning.id)}
                        className="ml-3 p-2 hover:bg-red-600/20 rounded transition-colors"
                      >
                        <FaTrash className="text-red-400" size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
