'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBan, FaExclamationTriangle, FaEye, FaLock, FaUnlock, FaTimes, FaEdit, FaTrash, FaNewspaper } from 'react-icons/fa';
import EditPostModal from './EditPostModal';

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

interface Warning {
  id: string;
  message: string;
  createdAt: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [viewWarningsUser, setViewWarningsUser] = useState<User | null>(null);
  const [userWarnings, setUserWarnings] = useState<Warning[]>([]);
  const [editingWarning, setEditingWarning] = useState<Warning | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [deletingWarning, setDeletingWarning] = useState<Warning | null>(null);
  const [viewPostsUser, setViewPostsUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [previewPost, setPreviewPost] = useState<any>(null);
  const [deletingPost, setDeletingPost] = useState<any>(null);
  const [warningPost, setWarningPost] = useState<any>(null);
  const [postWarningMessage, setPostWarningMessage] = useState('');
  const [viewPostWarnings, setViewPostWarnings] = useState<any>(null);
  const [editingPostWarning, setEditingPostWarning] = useState<any>(null);
  const [editPostWarningMessage, setEditPostWarningMessage] = useState('');
  const [deletingPostWarning, setDeletingPostWarning] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

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

  const handleBlockUser = async (userId: string, block: boolean) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRestrictUser = async (userId: string, restrict: boolean) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/restrict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restrict }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error restricting user:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleWarnUser = async (userId: string) => {
    if (!warningMessage.trim()) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: warningMessage }),
      });

      if (res.ok) {
        setWarningMessage('');
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error warning user:', error);
    } finally {
      setProcessing(false);
    }
  };

  const fetchUserWarnings = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/warnings`);
      if (res.ok) {
        const data = await res.json();
        setUserWarnings(data);
      }
    } catch (error) {
      console.error('Error fetching warnings:', error);
    }
  };

  const handleViewWarnings = async (user: User) => {
    setViewWarningsUser(user);
    await fetchUserWarnings(user.id);
  };

  const fetchUserPosts = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/posts`);
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched posts:', data);
        setUserPosts(data);
      } else {
        console.error('Failed to fetch posts:', res.status);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleViewPosts = async (user: User) => {
    setViewPostsUser(user);
    await fetchUserPosts(user.id);
  };

  const handleEditWarning = (warning: Warning) => {
    setEditingWarning(warning);
    setEditMessage(warning.message);
  };

  const handleUpdateWarning = async () => {
    if (!editingWarning || !editMessage.trim()) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/warnings/${editingWarning.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: editMessage }),
      });

      if (res.ok) {
        setEditingWarning(null);
        setEditMessage('');
        if (viewWarningsUser) {
          await fetchUserWarnings(viewWarningsUser.id);
        }
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating warning:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteWarning = async (warningId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/warnings/${warningId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletingWarning(null);
        if (viewWarningsUser) {
          await fetchUserWarnings(viewWarningsUser.id);
        }
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting warning:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletingPost(null);
        if (viewPostsUser) {
          await fetchUserPosts(viewPostsUser.id);
        }
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleWarnPost = async (postId: string) => {
    if (!postWarningMessage.trim()) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: postWarningMessage }),
      });

      if (res.ok) {
        setWarningPost(null);
        setPostWarningMessage('');
        if (viewPostsUser) {
          await fetchUserPosts(viewPostsUser.id);
        }
      }
    } catch (error) {
      console.error('Error warning post:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleEditPostWarning = async (postId: string, warningId: string) => {
    if (!editPostWarningMessage.trim()) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/warnings/${warningId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: editPostWarningMessage }),
      });

      if (res.ok) {
        setEditingPostWarning(null);
        setEditPostWarningMessage('');
        if (viewPostsUser) {
          await fetchUserPosts(viewPostsUser.id);
        }
      }
    } catch (error) {
      console.error('Error editing post warning:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeletePostWarning = async (postId: string, warningId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/warnings/${warningId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletingPostWarning(null);
        setViewPostWarnings(null);
        if (viewPostsUser) {
          await fetchUserPosts(viewPostsUser.id);
        }
      }
    } catch (error) {
      console.error('Error deleting post warning:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/delete`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletingUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Nie można usunąć użytkownika');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Wystąpił błąd podczas usuwania użytkownika');
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

  // Filtrowanie użytkowników
  const filteredUsers = users.filter(user => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.id.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.discordUsername?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="space-y-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20 mb-6">
          <p className="text-gray-400 text-sm mb-4">
            Zarządzaj użytkownikami platformy. Możesz blokować konta, ograniczać dostęp i wysyłać ostrzeżenia.
          </p>
          
          {/* Wyszukiwarka */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj po ID, nazwie, email lub Discord..."
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors pl-4"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          <div className="mt-3 text-sm text-gray-400">
            Znaleziono: <span className="text-purple-400 font-semibold">{filteredUsers.length}</span> użytkowników
          </div>
        </div>

      {filteredUsers.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`bg-gray-800/50 rounded-xl p-6 border transition-all ${
            user.isBlocked
              ? 'border-red-500/30'
              : user.isRestricted
              ? 'border-yellow-500/30'
              : 'border-purple-500/20'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{user.name}</h3>
                  {user.isBlocked && (
                    <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs font-semibold rounded border border-red-500/30">
                      ZABLOKOWANY
                    </span>
                  )}
                  {user.isRestricted && (
                    <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs font-semibold rounded border border-yellow-500/30">
                      OGRANICZONY
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-400">
                  {user.email && <p>Email: {user.email}</p>}
                  {user.discordUsername && (
                    <p>Discord: {user.discordUsername} ({user.discordId})</p>
                  )}
                  <p>Dołączył: {new Date(user.createdAt).toLocaleDateString('pl-PL')}</p>
                  <p>Posty: {user._count.posts} | Ostrzeżenia: {user._count.warnings}</p>
                </div>

                {selectedUser?.id === user.id && (
                  <div className="mt-4 space-y-2">
                    <textarea
                      value={warningMessage}
                      onChange={(e) => setWarningMessage(e.target.value)}
                      placeholder="Wpisz treść ostrzeżenia..."
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-yellow-500/30 focus:border-yellow-500 focus:outline-none resize-none text-sm"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleWarnUser(user.id)}
                        disabled={processing || !warningMessage.trim()}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-sm"
                      >
                        Wyślij ostrzeżenie
                      </motion.button>
                      <button
                        onClick={() => {
                          setSelectedUser(null);
                          setWarningMessage('');
                        }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleViewPosts(user)}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                title="Zobacz posty"
              >
                <FaNewspaper size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleViewWarnings(user)}
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                title="Zobacz ostrzeżenia"
              >
                <FaEye size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                title="Dodaj ostrzeżenie"
              >
                <FaExclamationTriangle size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleRestrictUser(user.id, !user.isRestricted)}
                disabled={processing}
                className={`p-2 rounded-lg transition-colors ${
                  user.isRestricted
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                } text-white`}
                title={user.isRestricted ? 'Usuń ograniczenie' : 'Ogranicz'}
              >
                {user.isRestricted ? <FaUnlock size={18} /> : <FaLock size={18} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBlockUser(user.id, !user.isBlocked)}
                disabled={processing}
                className={`p-2 rounded-lg transition-colors ${
                  user.isBlocked
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
                title={user.isBlocked ? 'Odblokuj' : 'Zablokuj'}
              >
                <FaBan size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDeletingUser(user)}
                disabled={processing}
                className="p-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors"
                title="Usuń użytkownika"
              >
                <FaTrash size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

      {/* Modal ostrzeżeń użytkownika */}
      <AnimatePresence>
        {viewWarningsUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => {
              setViewWarningsUser(null);
              setUserWarnings([]);
              setEditingWarning(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Ostrzeżenia użytkownika
                  </h2>
                  <p className="text-gray-400">{viewWarningsUser?.name}</p>
                </div>
                <button
                  onClick={() => {
                    setViewWarningsUser(null);
                    setUserWarnings([]);
                    setEditingWarning(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {userWarnings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    Ten użytkownik nie ma żadnych ostrzeżeń.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userWarnings.map((warning) => (
                    <div
                      key={warning.id}
                      className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/30 rounded-xl p-4"
                    >
                      {editingWarning?.id === warning.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                            rows={3}
                            placeholder="Treść ostrzeżenia..."
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdateWarning}
                              disabled={processing || !editMessage.trim()}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              Zapisz
                            </button>
                            <button
                              onClick={() => {
                                setEditingWarning(null);
                                setEditMessage('');
                              }}
                              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                            >
                              Anuluj
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-gray-300 flex-1">{warning.message}</p>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleEditWarning(warning)}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                title="Edytuj"
                              >
                                <FaEdit size={14} />
                              </button>
                              <button
                                onClick={() => setDeletingWarning(warning)}
                                disabled={processing}
                                className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                                title="Usuń"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(warning.createdAt).toLocaleDateString('pl-PL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal potwierdzenia usunięcia ostrzeżenia */}
      <AnimatePresence>
        {deletingWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setDeletingWarning(null)}
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

              <div className="bg-yellow-900/20 rounded-xl p-4 mb-6 border border-yellow-500/30">
                <p className="text-yellow-400 text-sm font-semibold mb-2">⚠️ Treść ostrzeżenia:</p>
                <p className="text-gray-300 text-sm">{deletingWarning.message}</p>
                <p className="text-gray-500 text-xs mt-2">
                  {new Date(deletingWarning.createdAt).toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <p className="text-gray-300 mb-6">
                Czy na pewno chcesz usunąć to ostrzeżenie? Status użytkownika zostanie automatycznie zaktualizowany na podstawie pozostałych ostrzeżeń.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteWarning(deletingWarning.id)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {processing ? 'Usuwanie...' : 'Usuń ostrzeżenie'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeletingWarning(null)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Anuluj
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal podglądu postów użytkownika */}
      <AnimatePresence>
        {viewPostsUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => {
              setViewPostsUser(null);
              setUserPosts([]);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-blue-500/30 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Posty użytkownika
                  </h2>
                  <p className="text-gray-400">{viewPostsUser?.name}</p>
                </div>
                <button
                  onClick={() => {
                    setViewPostsUser(null);
                    setUserPosts([]);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <FaNewspaper size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">Użytkownik nie ma jeszcze żadnych postów</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-gray-800/50 rounded-xl p-4 border ${
                        post.status === 'APPROVED'
                          ? 'border-green-500/30'
                          : post.status === 'REJECTED'
                          ? 'border-red-500/30'
                          : 'border-yellow-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{post.title}</h3>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              post.status === 'APPROVED'
                                ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                                : post.status === 'REJECTED'
                                ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                                : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                            }`}
                          >
                            {post.status === 'APPROVED'
                              ? 'Zatwierdzony'
                              : post.status === 'REJECTED'
                              ? 'Odrzucony'
                              : 'Weryfikowanie'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {post.description}
                      </p>
                      {post.images && post.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {post.images.slice(0, 4).map((img: string, idx: number) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${post.title} - ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                          {post.images.length > 4 && (
                            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                              +{post.images.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Ostrzeżenia dla posta */}
                      {post.warnings && post.warnings.length > 0 && (
                        <div className="mb-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FaExclamationTriangle className="text-yellow-500" size={14} />
                              <span className="text-yellow-400 font-semibold text-sm">
                                Ostrzeżenia ({post.warnings.length})
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setViewPostWarnings(post)}
                              className="text-xs text-yellow-400 hover:text-yellow-300 underline"
                            >
                              Zobacz wszystkie
                            </motion.button>
                          </div>
                          <p className="text-yellow-300/80 text-xs line-clamp-1">
                            {post.warnings[0].message}
                          </p>
                        </div>
                      )}
                      
                      {/* Akcje dla posta */}
                      <div className="flex gap-2 pt-3 border-t border-gray-700">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPreviewPost(post)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                        >
                          <FaEye size={14} />
                          Podgląd
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingPost(post)}
                          className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                        >
                          <FaEdit size={14} />
                          Edytuj
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setWarningPost(post)}
                          className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
                        >
                          <FaExclamationTriangle size={14} />
                          Ostrzeż
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDeletingPost(post)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                          <FaTrash size={14} />
                          Usuń
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal podglądu posta */}
      <AnimatePresence>
        {previewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
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

              {/* Symulacja posta */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-purple-500/20 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  {previewPost.user?.image ? (
                    <img
                      src={previewPost.user.image}
                      alt={previewPost.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {previewPost.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white text-lg">{previewPost.user?.name || 'Użytkownik'}</p>
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
                    {previewPost.images.map((img: string, idx: number) => (
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
                  💡 Tak wygląda ten post dla wszystkich użytkowników na stronie głównej
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal ostrzeżenia dla posta */}
      <AnimatePresence>
        {warningPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => {
              setWarningPost(null);
              setPostWarningMessage('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full border border-yellow-500/30 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle size={24} className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Dodaj ostrzeżenie</h3>
                  <p className="text-gray-400 text-sm">Powód ostrzeżenia dla posta</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700">
                <p className="text-white font-semibold mb-1">{warningPost.title}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{warningPost.description}</p>
              </div>

              <textarea
                value={postWarningMessage}
                onChange={(e) => setPostWarningMessage(e.target.value)}
                placeholder="Wpisz powód ostrzeżenia..."
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-yellow-500/30 focus:border-yellow-500 focus:outline-none resize-none mb-4"
                rows={4}
              />

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleWarnPost(warningPost.id)}
                  disabled={processing || !postWarningMessage.trim()}
                  className="flex-1 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {processing ? 'Wysyłanie...' : 'Wyślij ostrzeżenie'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setWarningPost(null);
                    setPostWarningMessage('');
                  }}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Anuluj
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal usuwania posta */}
      <AnimatePresence>
        {deletingPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
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
                  onClick={() => handleDeletePost(deletingPost.id)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {processing ? 'Usuwanie...' : 'Usuń post'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeletingPost(null)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Anuluj
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal podglądu ostrzeżeń posta */}
      <AnimatePresence>
        {viewPostWarnings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setViewPostWarnings(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-yellow-500/30 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Ostrzeżenia posta</h2>
                  <p className="text-gray-400">{viewPostWarnings.title}</p>
                </div>
                <button
                  onClick={() => setViewPostWarnings(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {viewPostWarnings.warnings && viewPostWarnings.warnings.length > 0 ? (
                <div className="space-y-3">
                  {viewPostWarnings.warnings.map((warning: any) => (
                    <motion.div
                      key={warning.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FaExclamationTriangle className="text-yellow-500 flex-shrink-0" size={16} />
                          <span className="text-xs text-gray-400">
                            {new Date(warning.createdAt).toLocaleString('pl-PL')}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditingPostWarning(warning);
                              setEditPostWarningMessage(warning.message);
                            }}
                            className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                            title="Edytuj"
                          >
                            <FaEdit size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeletingPostWarning(warning)}
                            className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                            title="Usuń"
                          >
                            <FaTrash size={14} />
                          </motion.button>
                        </div>
                      </div>
                      <p className="text-yellow-200 text-sm leading-relaxed">{warning.message}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaExclamationTriangle size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">Brak ostrzeżeń dla tego posta</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal edycji ostrzeżenia posta */}
      <AnimatePresence>
        {editingPostWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => {
              setEditingPostWarning(null);
              setEditPostWarningMessage('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full border border-blue-500/30 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <FaEdit size={24} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Edytuj ostrzeżenie</h3>
                  <p className="text-gray-400 text-sm">Zmień treść ostrzeżenia</p>
                </div>
              </div>

              <textarea
                value={editPostWarningMessage}
                onChange={(e) => setEditPostWarningMessage(e.target.value)}
                placeholder="Wpisz treść ostrzeżenia..."
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-blue-500/30 focus:border-blue-500 focus:outline-none resize-none mb-4"
                rows={4}
              />

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEditPostWarning(viewPostWarnings.id, editingPostWarning.id)}
                  disabled={processing || !editPostWarningMessage.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {processing ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setEditingPostWarning(null);
                    setEditPostWarningMessage('');
                  }}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Anuluj
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal usuwania ostrzeżenia posta */}
      <AnimatePresence>
        {deletingPostWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setDeletingPostWarning(null)}
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
                  <h3 className="text-xl font-bold text-white">Usuń ostrzeżenie</h3>
                  <p className="text-gray-400 text-sm">Ta operacja jest nieodwracalna</p>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-200 text-sm">{deletingPostWarning.message}</p>
              </div>

              <p className="text-gray-300 mb-6">
                Czy na pewno chcesz usunąć to ostrzeżenie?
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeletePostWarning(viewPostWarnings.id, deletingPostWarning.id)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {processing ? 'Usuwanie...' : 'Usuń ostrzeżenie'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeletingPostWarning(null)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Anuluj
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal edycji posta */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSuccess={() => {
            setEditingPost(null);
            if (viewPostsUser) {
              fetchUserPosts(viewPostsUser.id);
            }
          }}
        />
      )}

      {/* Modal potwierdzenia usunięcia użytkownika */}
      <AnimatePresence>
        {deletingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setDeletingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-500/50 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                  <FaTrash className="text-red-500" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Usuń użytkownika</h3>
                  <p className="text-gray-400 text-sm">Ta operacja jest nieodwracalna!</p>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  {deletingUser.image ? (
                    <img src={deletingUser.image} alt={deletingUser.name} className="w-12 h-12 rounded-full" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                      {deletingUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold">{deletingUser.name}</p>
                    <p className="text-gray-400 text-sm">{deletingUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-200 text-sm font-semibold mb-2">⚠️ Uwaga!</p>
                <p className="text-yellow-200 text-sm">
                  Usunięcie użytkownika spowoduje <strong>trwałe usunięcie</strong>:
                </p>
                <ul className="list-disc list-inside text-yellow-200 text-sm mt-2 space-y-1">
                  <li>Wszystkich postów użytkownika</li>
                  <li>Wszystkich komentarzy</li>
                  <li>Wszystkich ostrzeżeń</li>
                  <li>Konta i danych osobowych</li>
                </ul>
              </div>

              <p className="text-gray-300 mb-6">
                Czy na pewno chcesz <strong className="text-red-400">permanentnie usunąć</strong> tego użytkownika?
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteUser(deletingUser.id)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {processing ? 'Usuwanie...' : 'TAK, Usuń użytkownika'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeletingUser(null)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Anuluj
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
