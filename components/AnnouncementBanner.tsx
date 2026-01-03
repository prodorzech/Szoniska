'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaCheckSquare, FaTimes } from 'react-icons/fa';

interface Announcement {
  id: string;
  message: string;
  type: string;
  isActive: boolean;
}

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const res = await fetch('/api/admin/announcement');
      if (res.ok) {
        const data = await res.json();
        if (data && data.isActive) {
          setAnnouncement(data);
        }
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    }
  };

  if (!announcement || dismissed) return null;

  const getIcon = () => {
    switch (announcement.type) {
      case 'info':
        return <FaInfoCircle size={20} />;
      case 'warning':
        return <FaExclamationTriangle size={20} />;
      case 'error':
        return <FaExclamationCircle size={20} />;
      case 'success':
        return <FaCheckSquare size={20} />;
      default:
        return <FaInfoCircle size={20} />;
    }
  };

  const getStyle = () => {
    switch (announcement.type) {
      case 'info':
        return 'bg-blue-600/90 border-blue-400';
      case 'warning':
        return 'bg-yellow-600/90 border-yellow-400';
      case 'error':
        return 'bg-red-600/90 border-red-400';
      case 'success':
        return 'bg-green-600/90 border-green-400';
      default:
        return 'bg-blue-600/90 border-blue-400';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`${getStyle()} border-b-2 backdrop-blur-sm`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0 text-white">
                {getIcon()}
              </div>
              <p className="text-white font-medium text-sm md:text-base">
                {announcement.message}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Zamknij"
            >
              <FaTimes className="text-white" size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
