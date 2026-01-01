'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEye } from 'react-icons/fa';
import UserDetailModal from './UserDetailModal';

interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
  discordId?: string;
  discordUsername?: string;
  isBlocked: boolean;
  isRestricted: boolean;
  createdAt: string;
  _count: {
    posts: number;
    warnings: number;
  };
}

export default function UsersManagementNew() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.discordUsername?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
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
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj użytkownika (nazwa, email, Discord)..."
            className="w-full bg-gray-800/50 text-white pl-12 pr-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Users Count */}
      <div className="mb-4">
        <p className="text-gray-400">
          Znaleziono: <span className="text-white font-semibold">{filteredUsers.length}</span> użytkowników
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800/30 rounded-lg overflow-hidden border border-purple-500/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Użytkownik
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Email / Discord
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Posty
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Ostrzeżenia
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nie znaleziono użytkowników
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full border-2 border-purple-500"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-purple-500">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.email && (
                        <p className="text-white text-sm">{user.email}</p>
                      )}
                      {user.discordUsername && (
                        <p className="text-purple-400 text-sm">@{user.discordUsername}</p>
                      )}
                      {!user.email && !user.discordUsername && (
                        <p className="text-gray-500 text-sm">Brak</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-white font-semibold">{user._count.posts}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user._count.warnings > 0
                            ? 'bg-red-600/20 text-red-400'
                            : 'bg-gray-700/50 text-gray-400'
                        }`}
                      >
                        {user._count.warnings}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-center">
                        {user.isBlocked && (
                          <span className="px-2 py-1 bg-red-600/20 border border-red-500/30 rounded text-red-400 text-xs">
                            Zablokowany
                          </span>
                        )}
                        {user.isRestricted && (
                          <span className="px-2 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded text-yellow-400 text-xs">
                            Ograniczony
                          </span>
                        )}
                        {!user.isBlocked && !user.isRestricted && (
                          <span className="px-2 py-1 bg-green-600/20 border border-green-500/30 rounded text-green-400 text-xs">
                            Aktywny
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                      >
                        <FaEye />
                        Zarządzaj
                      </motion.button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={() => {
            fetchUsers();
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
