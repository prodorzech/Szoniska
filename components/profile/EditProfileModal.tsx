'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCamera, FaEdit } from 'react-icons/fa';

interface EditProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({ onClose, onSuccess }: EditProfileModalProps) {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(session?.user?.image || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      setError('Plik jest za duży (max 5MB)');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Plik musi być obrazem');
      return;
    }

    setError('');
    setAvatar(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      // Update name if changed
      if (name !== session?.user?.name) {
        const nameRes = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });

        if (!nameRes.ok) {
          const data = await nameRes.json();
          throw new Error(data.error || 'Failed to update name');
        }
      }

      // Upload avatar if changed
      if (avatar) {
        const formData = new FormData();
        formData.append('file', avatar);

        const avatarRes = await fetch('/api/user/avatar', {
          method: 'POST',
          body: formData,
        });

        if (!avatarRes.ok) {
          const data = await avatarRes.json();
          throw new Error(data.error || 'Failed to upload avatar');
        }
      }

      // Update session
      await update();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Edytuj profil</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-400" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-purple-500">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaCamera className="text-white" size={32} />
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              
              <p className="text-gray-400 text-sm mt-3">
                Kliknij na avatar aby zmienić (max 5MB)
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nazwa użytkownika
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={2}
                  maxLength={50}
                  required
                  className="w-full bg-gray-800 text-white px-4 py-3 pl-10 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Twoja nazwa"
                />
                <FaEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {uploading ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                disabled={uploading}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                Anuluj
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
