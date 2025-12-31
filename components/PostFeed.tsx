'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaThumbtack } from 'react-icons/fa';
import PostCard from './PostCard';
import PostModal from './PostModal';
import type { Post } from '@/types/post';

export default function PostFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (search?: string) => {
    setSearching(true);
    try {
      const url = search ? `/api/posts?search=${encodeURIComponent(search)}` : '/api/posts';
      const res = await fetch(url);
      
      if (res.status === 403) {
        const data = await res.json();
        setError(data.error);
        setLoading(false);
        return;
      }
      
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchPosts();
  };

  const handlePinPost = async (postId: string, pin: boolean) => {
    try {
      const res = await fetch(`/api/admin/posts/${postId}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        fetchPosts(searchQuery || undefined);
      } else {
        const data = await res.json();
        alert(data.error || 'Nie udało się przypiąć posta');
      }
    } catch (error) {
      console.error('Error pinning post:', error);
      alert('Wystąpił błąd podczas przypinania posta');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="max-w-md mx-auto bg-gradient-to-br from-red-900/20 to-red-800/10 border-2 border-red-500/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Konto zablokowane</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (posts.length === 0 && !searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <h2 className="text-2xl text-gray-400 mb-4">Brak postów</h2>
        <p className="text-gray-500">Bądź pierwszy i stwórz post!</p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Wyszukiwarka */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/20 mb-6"
      >
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj po tytule, nicku autora lub Discord ID..."
              className="w-full bg-gray-800 text-white pl-11 pr-10 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={searching}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {searching ? 'Szukam...' : 'Szukaj'}
          </motion.button>
        </form>
      </motion.div>

      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <h2 className="text-2xl text-gray-400 mb-4">Nie znaleziono postów</h2>
          <p className="text-gray-500">Spróbuj zmienić kryteria wyszukiwania</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {post.isPinned && (
                <div className="absolute -top-2 -right-2 z-10 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <FaThumbtack />
                  Przypięte
                </div>
              )}
              <PostCard post={post} onClick={() => setSelectedPost(post)} />
              {session?.user?.isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinPost(post.id, !post.isPinned);
                  }}
                  className={`absolute top-2 left-2 z-10 p-2 rounded-full shadow-lg transition-colors ${
                    post.isPinned
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'bg-gray-800/90 hover:bg-gray-700 text-gray-400'
                  }`}
                  title={post.isPinned ? 'Odepnij post' : 'Przypnij post'}
                >
                  <FaThumbtack />
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onUpdate={fetchPosts}
        />
      )}
    </>
  );
}
