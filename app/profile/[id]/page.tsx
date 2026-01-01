'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaNewspaper, FaExclamationTriangle, FaCalendarAlt, FaDiscord } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
  discordUsername?: string;
  createdAt: string;
  isBlocked: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
  _count: {
    posts: number;
    warnings: number;
  };
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setError('Nie znaleziono użytkownika');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas ładowania profilu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Ładowanie...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">{error || 'Nie znaleziono użytkownika'}</h1>
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
          <div className="flex items-start gap-6 mb-8">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-purple-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-purple-500">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              {user.discordUsername && (
                <p className="text-purple-400 flex items-center gap-2 mb-2">
                  <FaDiscord /> {user.discordUsername}
                </p>
              )}
              <p className="text-gray-400 flex items-center gap-2">
                <FaCalendarAlt /> Dołączył {new Date(user.createdAt).toLocaleDateString('pl-PL')}
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            {user.isBlocked && (
              <span className="px-4 py-2 bg-red-900 text-red-200 rounded-full font-semibold">
                Zablokowany
              </span>
            )}
            {user.isRestricted && (
              <span className="px-4 py-2 bg-yellow-900 text-yellow-200 rounded-full font-semibold">
                Ograniczony
              </span>
            )}
            {!user.isBlocked && !user.isRestricted && (
              <span className="px-4 py-2 bg-green-900 text-green-200 rounded-full font-semibold">
                Aktywny
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <FaNewspaper className="text-purple-400 text-2xl" />
                <h3 className="text-gray-400 font-semibold">Posty</h3>
              </div>
              <p className="text-4xl font-bold text-white">{user._count.posts}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <FaExclamationTriangle className="text-yellow-400 text-2xl" />
                <h3 className="text-gray-400 font-semibold">Ostrzeżenia</h3>
              </div>
              <p className="text-4xl font-bold text-white">{user._count.warnings}</p>
            </div>
          </div>

          {/* Restriction Reason */}
          {user.isRestricted && user.restrictionReason && (
            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <h3 className="text-yellow-400 font-semibold mb-2">Powód ograniczenia:</h3>
              <p className="text-gray-300">{user.restrictionReason}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
