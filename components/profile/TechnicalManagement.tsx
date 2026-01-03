'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTools, FaPlus, FaTrash, FaClock, FaCheckCircle, FaBullhorn, FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaCheckSquare } from 'react-icons/fa';

interface Maintenance {
  id: string;
  type: string;
  reason: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
}

interface Announcement {
  id: string;
  message: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

export default function TechnicalManagement() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'profile',
    reason: '',
    hours: 1,
  });
  const [announcementData, setAnnouncementData] = useState({
    message: '',
    type: 'info',
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchMaintenances();
    fetchAnnouncement();
    // Check every minute for expired maintenances
    const interval = setInterval(fetchMaintenances, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMaintenances = async () => {
    try {
      const res = await fetch('/api/admin/maintenance');
      if (res.ok) {
        const data = await res.json();
        setMaintenances(data);
      }
    } catch (error) {
      console.error('Error fetching maintenances:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncement = async () => {
    try {
      const res = await fetch('/api/admin/announcement');
      if (res.ok) {
        const data = await res.json();
        setAnnouncement(data);
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    }
  };

  const handleAddMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason.trim()) return;

    setProcessing(true);
    try {
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + formData.hours);

      const res = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          reason: formData.reason,
          endTime: endTime.toISOString(),
        }),
      });

      if (res.ok) {
        setFormData({ type: 'profile', reason: '', hours: 1 });
        setShowAddForm(false);
        fetchMaintenances();
      }
    } catch (error) {
      console.error('Error adding maintenance:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteMaintenance = async (id: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/maintenance/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchMaintenances();
      }
    } catch (error) {
      console.error('Error deleting maintenance:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementData.message.trim()) return;

    setProcessing(true);
    try {
      const res = await fetch('/api/admin/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData),
      });

      if (res.ok) {
        setAnnouncementData({ message: '', type: 'info' });
        setShowAnnouncementForm(false);
        fetchAnnouncement();
      }
    } catch (error) {
      console.error('Error adding announcement:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/announcement', {
        method: 'DELETE',
      });

      if (res.ok) {
        setAnnouncement(null);
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Wygasło';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'profile':
        return 'Profile użytkowników';
      default:
        return type;
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <FaInfoCircle className="text-blue-400" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-400" />;
      case 'error':
        return <FaExclamationCircle className="text-red-400" />;
      case 'success':
        return <FaCheckSquare className="text-green-400" />;
      default:
        return <FaInfoCircle className="text-blue-400" />;
    }
  };

  const getAnnouncementStyle = (type: string) => {
    switch (type) {
      case 'info':
        return 'from-blue-900/20 to-blue-800/10 border-blue-500/30';
      case 'warning':
        return 'from-yellow-900/20 to-yellow-800/10 border-yellow-500/30';
      case 'error':
        return 'from-red-900/20 to-red-800/10 border-red-500/30';
      case 'success':
        return 'from-green-900/20 to-green-800/10 border-green-500/30';
      default:
        return 'from-blue-900/20 to-blue-800/10 border-blue-500/30';
    }
  };

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
      {/* Announcement Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <FaBullhorn className="text-purple-400" />
              Ogłoszenie globalne
            </h2>
            <p className="text-gray-400">Wyświetlane na górze strony głównej dla wszystkich użytkowników</p>
          </div>
          {!announcement && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Dodaj ogłoszenie
            </motion.button>
          )}
        </div>

        {/* Announcement Form */}
        <AnimatePresence>
          {showAnnouncementForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <form onSubmit={handleAddAnnouncement} className="bg-gray-800/30 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-4">Nowe ogłoszenie</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Typ ogłoszenia
                  </label>
                  <select
                    value={announcementData.type}
                    onChange={(e) => setAnnouncementData({ ...announcementData, type: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="info">Informacja (niebieski)</option>
                    <option value="warning">Ostrzeżenie (żółty)</option>
                    <option value="error">Błąd (czerwony)</option>
                    <option value="success">Sukces (zielony)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Treść ogłoszenia
                  </label>
                  <textarea
                    value={announcementData.message}
                    onChange={(e) => setAnnouncementData({ ...announcementData, message: e.target.value })}
                    placeholder="np. Witamy na nowej wersji strony! 🎉"
                    rows={3}
                    required
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {processing ? 'Dodawanie...' : 'Dodaj'}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementForm(false)}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Announcement */}
        {announcement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br rounded-lg p-6 border-2 ${getAnnouncementStyle(announcement.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-black/30 rounded-lg mt-1">
                  {getAnnouncementIcon(announcement.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white text-lg">{announcement.message}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Utworzono: {new Date(announcement.createdAt).toLocaleString('pl-PL')}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteAnnouncement}
                disabled={processing}
                className="ml-4 p-3 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
              >
                <FaTrash className="text-red-400" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {!announcement && !showAnnouncementForm && (
          <div className="bg-gray-800/30 rounded-lg p-8 border border-purple-500/20 text-center">
            <FaBullhorn className="text-gray-600 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">Brak aktywnego ogłoszenia</p>
          </div>
        )}
      </div>

      {/* Maintenance Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Zarządzanie techniczne</h2>
          <p className="text-gray-400">Tymczasowo wyłącz funkcje strony z określonym powodem i czasem</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Dodaj utrzymanie
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <form onSubmit={handleAddMaintenance} className="bg-gray-800/30 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Nowe utrzymanie techniczne</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Typ funkcji
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="profile">Profile użytkowników</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Czas trwania (godziny)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Powód wyłączenia
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="np. Prace konserwacyjne na profilach użytkowników..."
                  rows={3}
                  required
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={processing}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {processing ? 'Dodawanie...' : 'Dodaj'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Maintenances */}
      <div className="space-y-4">
        {maintenances.length === 0 ? (
          <div className="bg-gray-800/30 rounded-lg p-8 border border-purple-500/20 text-center">
            <FaTools className="text-gray-600 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">Brak aktywnych utrzymań technicznych</p>
          </div>
        ) : (
          maintenances.map((maintenance) => {
            const isExpired = new Date(maintenance.endTime) <= new Date();
            const timeRemaining = getTimeRemaining(maintenance.endTime);

            return (
              <motion.div
                key={maintenance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br rounded-lg p-6 border-2 ${
                  isExpired
                    ? 'from-gray-800/30 to-gray-900/30 border-gray-600/30'
                    : 'from-orange-900/20 to-orange-800/10 border-orange-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        isExpired ? 'bg-gray-700/50' : 'bg-orange-600/20'
                      }`}>
                        {isExpired ? (
                          <FaCheckCircle className="text-gray-400" size={20} />
                        ) : (
                          <FaTools className="text-orange-400" size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {getTypeLabel(maintenance.type)}
                        </h3>
                        <p className={`text-sm ${isExpired ? 'text-gray-500' : 'text-orange-300'}`}>
                          {isExpired ? 'Zakończone' : 'Aktywne'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 mb-3">
                      <p className="text-gray-300">{maintenance.reason}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Rozpoczęto</p>
                        <p className="text-white font-medium">
                          {new Date(maintenance.startTime).toLocaleString('pl-PL')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Zakończenie</p>
                        <p className="text-white font-medium">
                          {new Date(maintenance.endTime).toLocaleString('pl-PL')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Pozostało</p>
                        <p className={`font-medium ${
                          isExpired ? 'text-gray-500' : 'text-orange-400'
                        }`}>
                          <FaClock className="inline mr-1" />
                          {timeRemaining}
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteMaintenance(maintenance.id)}
                    disabled={processing}
                    className="ml-4 p-3 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                  >
                    <FaTrash className="text-red-400" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
