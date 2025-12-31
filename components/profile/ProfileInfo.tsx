'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface UserStats {
  postsCount: number;
  approvedPosts: number;
  pendingPosts: number;
  rejectedPosts: number;
  createdAt: string;
}

export default function ProfileInfo() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/user/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Informacje o koncie</h2>
        <div className="space-y-3">
          {session?.user.id && (
            <div>
              <span className="text-gray-400">ID użytkownika:</span>
              <span className="ml-3 text-white font-mono text-sm bg-gray-900 px-2 py-1 rounded">{session.user.id}</span>
            </div>
          )}
          {session?.user.email && (
            <div>
              <span className="text-gray-400">Email:</span>
              <span className="ml-3 text-white font-medium">{session.user.email}</span>
            </div>
          )}
          {stats && (
            <div>
              <span className="text-gray-400">Data utworzenia konta:</span>
              <span className="ml-3 text-white font-medium">
                {new Date(stats.createdAt).toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Statystyki</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30">
              <p className="text-gray-400 text-sm mb-2">Wszystkie posty</p>
              <p className="text-4xl font-bold text-white">{stats.postsCount}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-500/30">
              <p className="text-gray-400 text-sm mb-2">Zweryfikowane</p>
              <p className="text-4xl font-bold text-white">{stats.approvedPosts}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-xl p-6 border border-yellow-500/30">
              <p className="text-gray-400 text-sm mb-2">Oczekujące</p>
              <p className="text-4xl font-bold text-white">{stats.pendingPosts}</p>
            </div>
            <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-xl p-6 border border-red-500/30">
              <p className="text-gray-400 text-sm mb-2">Odrzucone</p>
              <p className="text-4xl font-bold text-white">{stats.rejectedPosts}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
