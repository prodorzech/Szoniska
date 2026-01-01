'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBan, FaExclamationTriangle, FaLock, FaUnlock, FaTrash, FaEdit, FaEye, FaNewspaper, FaDiscord } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
  discordId?: string;
  discordUsername?: string;
  isBlocked: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
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

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UserDetailModal({ user, onClose, onUpdate }: UserDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [showPosts, setShowPosts] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [newWarning, setNewWarning] = useState('');
  const [discordLinkId, setDiscordLinkId] = useState('');
  const [authLink, setAuthLink] = useState('');
  const [showConfirmBlock, setShowConfirmBlock] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showRestrictForm, setShowRestrictForm] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState(user.restrictionReason || '');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user.name,
    email: user.email || '',
    password: '',
  });
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchWarnings();
    fetchPosts();
  }, []);

  const fetchWarnings = async () => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/warnings`);
      if (res.ok) {
        const data = await res.json();
        setWarnings(data);
      }
    } catch (error) {
      console.error('Error fetching warnings:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleBlock = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block: !user.isBlocked }),
      });
      if (res.ok) {
        onUpdate();
        setShowConfirmBlock(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestrict = async () => {
    if (user.isRestricted) {
      // Odblokuj bez pytania o powód
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${user.id}/restrict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ restrict: false, reason: null }),
        });
        if (res.ok) {
          setShowRestrictForm(false);
          onUpdate();
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Pokaż formularz z powodem
      setShowRestrictForm(true);
    }
  };

  const handleRestrictWithReason = async () => {
    if (!restrictionReason.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/restrict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restrict: true, reason: restrictionReason }),
      });
      if (res.ok) {
        setShowRestrictForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWarning = async () => {
    if (!newWarning.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newWarning }),
      });
      if (res.ok) {
        setNewWarning('');
        fetchWarnings();
        onUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWarning = async (warningId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/warnings/${warningId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchWarnings();
        onUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkDiscord = async () => {
    if (!discordLinkId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/link-discord`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId: discordLinkId }),
      });
      if (res.ok) {
        const data = await res.json();
        setAuthLink(data.authLink);
        onUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEditMessage(null);

    try {
      const dataToSend: any = {};
      
      if (editFormData.name !== user.name) {
        dataToSend.name = editFormData.name;
      }
      
      if (editFormData.email !== user.email) {
        dataToSend.email = editFormData.email;
      }
      
      if (editFormData.password) {
        dataToSend.password = editFormData.password;
      }

      if (Object.keys(dataToSend).length === 0) {
        setEditMessage({ type: 'error', text: 'Brak zmian do zapisania' });
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/admin/users/${user.id}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (res.ok) {
        setEditMessage({ type: 'success', text: 'Dane zostały zaktualizowane' });
        setEditFormData({ ...editFormData, password: '' });
        onUpdate();
        setTimeout(() => {
          setShowEditForm(false);
          setEditMessage(null);
        }, 2000);
      } else {
        setEditMessage({ type: 'error', text: data.error || 'Wystąpił błąd' });
      }
    } catch (error) {
      setEditMessage({ type: 'error', text: 'Wystąpił błąd połączenia' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten post?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchPosts();
        onUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPostWarning = async (postId: string) => {
    const message = prompt('Podaj treść ostrzeżenia dla tego posta:');
    if (!message) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        fetchPosts();
        alert('Dodano ostrzeżenie do posta');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl p-6 w-full max-w-4xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full border-2 border-purple-500" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-2xl border-2 border-purple-500">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                {user.email && <p className="text-gray-400">{user.email}</p>}
                {user.discordUsername && (
                  <p className="text-purple-400 flex items-center gap-2">
                    <FaDiscord /> {user.discordUsername}
                  </p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <FaTimes className="text-gray-400" size={20} />
            </button>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">ID</p>
              <p className="text-white font-mono text-xs break-all">{user.id}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Posty</p>
              <p className="text-white text-xl font-bold">{user._count.posts}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Ostrzeżenia</p>
              <p className="text-white text-xl font-bold">{user._count.warnings}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Utworzono</p>
              <p className="text-white text-sm">{new Date(user.createdAt).toLocaleDateString('pl-PL')}</p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {user.isBlocked && (
              <span className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-red-400 text-sm">
                Zablokowany
              </span>
            )}
            {user.isRestricted && (
              <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm">
                Ograniczony
              </span>
            )}
            {!user.discordId && (
              <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm">
                Tradycyjne konto
              </span>
            )}
          </div>

          {/* Restriction Reason */}
          {user.isRestricted && user.restrictionReason && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                <FaLock /> Powód ograniczenia postów
              </h3>
              <p className="text-white">{user.restrictionReason}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEditForm(!showEditForm)}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-colors"
            >
              <FaEdit className="inline mr-2" />
              Edytuj dane
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowConfirmBlock(true)}
              disabled={loading}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                user.isBlocked
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <FaBan className="inline mr-2" />
              {user.isBlocked ? 'Odblokuj' : 'Zablokuj'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRestrict}
              disabled={loading}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                user.isRestricted
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              {user.isRestricted ? <FaUnlock className="inline mr-2" /> : <FaLock className="inline mr-2" />}
              {user.isRestricted ? 'Odblokuj posty' : 'Ogranicz posty'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(`/profile/${user.id}`, '_blank')}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition-colors"
            >
              <FaEye className="inline mr-2" />
              Zobacz profil
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowConfirmDelete(true)}
              disabled={loading}
              className="px-4 py-3 bg-red-900 hover:bg-red-800 rounded-lg font-semibold text-white transition-colors"
            >
              <FaTrash className="inline mr-2" />
              Usuń
            </motion.button>
          </div>

          {/* Edit Form */}
          {showEditForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4 mb-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaEdit /> Edytuj dane użytkownika
              </h3>
              
              {editMessage && (
                <div className={`mb-4 p-3 rounded-lg ${
                  editMessage.type === 'success' 
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}>
                  {editMessage.text}
                </div>
              )}

              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Nazwa użytkownika
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    placeholder="Nazwa użytkownika"
                    minLength={2}
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Nowe hasło (opcjonalne)
                  </label>
                  <input
                    type="password"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    placeholder="Minimum 6 znaków (zostaw puste aby nie zmieniać)"
                    minLength={6}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Pozostaw puste, jeśli nie chcesz zmieniać hasła
                  </p>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditMessage(null);
                      setEditFormData({
                        name: user.name,
                        email: user.email || '',
                        password: '',
                      });
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Anuluj
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Discord Linking (only for traditional accounts) */}
          {!user.discordId && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FaDiscord /> Połącz z Discord
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                Dodaj Discord ID użytkownika, aby móc połączyć to konto z Discord
              </p>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={discordLinkId}
                  onChange={(e) => setDiscordLinkId(e.target.value)}
                  placeholder="Discord ID (np. 1144910054001225779)"
                  className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-blue-500/30 focus:border-blue-500 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLinkDiscord}
                  disabled={loading || !discordLinkId.trim()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Połącz
                </motion.button>
              </div>
              {authLink && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm mb-2">Link autoryzacyjny wygenerowany! Wyślij go użytkownikowi:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={authLink}
                      readOnly
                      className="flex-1 bg-gray-900 text-white px-3 py-2 rounded text-sm font-mono"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(authLink)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      Kopiuj
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Posts Section */}
          <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaNewspaper className="text-blue-500" /> Posty użytkownika ({posts.length})
              </h3>
              <button
                onClick={() => setShowPosts(!showPosts)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
              >
                {showPosts ? 'Ukryj' : 'Pokaż'}
              </button>
            </div>

            {showPosts && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {posts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Brak postów</p>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{post.title}</h4>
                          <p className="text-gray-400 text-sm line-clamp-2">{post.content}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>{new Date(post.createdAt).toLocaleString('pl-PL')}</span>
                            {post._count?.postWarnings > 0 && (
                              <span className="text-yellow-400">
                                <FaExclamationTriangle className="inline mr-1" />
                                {post._count.postWarnings} ostrzeżeń
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => window.open(`/posts/${post.id}`, '_blank')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          <FaEye className="inline mr-1" /> Zobacz
                        </button>
                        <button
                          onClick={() => handleAddPostWarning(post.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
                        >
                          <FaExclamationTriangle className="inline mr-1" /> Ostrzeż
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          <FaTrash className="inline mr-1" /> Usuń
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Warnings Management Section */}
          <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-500" /> Zarządzanie ostrzeżeniami ({warnings.length})
              </h3>
              <button
                onClick={() => setShowWarnings(!showWarnings)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
              >
                {showWarnings ? 'Ukryj' : 'Pokaż'}
              </button>
            </div>

            {showWarnings && (
              <>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newWarning}
                    onChange={(e) => setNewWarning(e.target.value)}
                    placeholder="Dodaj nowe ostrzeżenie..."
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddWarning()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddWarning}
                    disabled={loading || !newWarning.trim()}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Dodaj
                  </motion.button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {warnings.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Brak ostrzeżeń</p>
                  ) : (
                    warnings.map((warning) => (
                      <div key={warning.id} className="bg-gray-900/50 rounded-lg p-3 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white">{warning.message}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(warning.createdAt).toLocaleString('pl-PL')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteWarning(warning.id)}
                          disabled={loading}
                          className="ml-3 p-2 hover:bg-red-600/20 rounded transition-colors"
                        >
                          <FaTrash className="text-red-400" size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Confirmation Dialogs */}
          {showRestrictForm && !user.isRestricted && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <h3 className="text-yellow-400 font-semibold mb-3">Ogranicz możliwość dodawania postów</h3>
              <p className="text-gray-300 text-sm mb-3">
                Podaj powód ograniczenia (będzie widoczny dla admina):
              </p>
              <textarea
                value={restrictionReason}
                onChange={(e) => setRestrictionReason(e.target.value)}
                placeholder="np. Spam, niewłaściwe treści..."
                rows={3}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-yellow-500/30 focus:border-yellow-500 focus:outline-none resize-none mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRestrictWithReason}
                  disabled={loading || !restrictionReason.trim()}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 text-white rounded-lg font-semibold"
                >
                  Ogranicz
                </button>
                <button
                  onClick={() => setShowRestrictForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}

          {showConfirmBlock && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <p className="text-yellow-400 mb-3">
                Czy na pewno chcesz {user.isBlocked ? 'odblokować' : 'zablokować'} użytkownika <strong>{user.name}</strong>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleBlock}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                >
                  Tak, {user.isBlocked ? 'odblokuj' : 'zablokuj'}
                </button>
                <button
                  onClick={() => setShowConfirmBlock(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}

          {showConfirmDelete && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 mb-3">
                Czy na pewno chcesz <strong>USUNĄĆ</strong> użytkownika <strong>{user.name}</strong>? 
                Ta akcja jest nieodwracalna!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteUser}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                >
                  Tak, usuń na zawsze
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
