'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaCheckSquare } from 'react-icons/fa';

interface Announcement {
  id: string;
  message: string;
  type: string;
  isActive: boolean;
}

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

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

  if (!announcement) return null;

  const getIcon = () => {
    switch (announcement.type) {
      case 'info':
        return <FaInfoCircle size={24} className="text-blue-400" />;
      case 'warning':
        return <FaExclamationTriangle size={24} className="text-yellow-400" />;
      case 'error':
        return <FaExclamationCircle size={24} className="text-red-400" />;
      case 'success':
        return <FaCheckSquare size={24} className="text-green-400" />;
      default:
        return <FaInfoCircle size={24} className="text-blue-400" />;
    }
  };

  const getGradient = () => {
    switch (announcement.type) {
      case 'info':
        return 'from-blue-600/20 via-blue-500/10 to-transparent';
      case 'warning':
        return 'from-yellow-600/20 via-yellow-500/10 to-transparent';
      case 'error':
        return 'from-red-600/20 via-red-500/10 to-transparent';
      case 'success':
        return 'from-green-600/20 via-green-500/10 to-transparent';
      default:
        return 'from-blue-600/20 via-blue-500/10 to-transparent';
    }
  };

  const getBorderColor = () => {
    switch (announcement.type) {
      case 'info':
        return 'border-blue-500/30';
      case 'warning':
        return 'border-yellow-500/30';
      case 'error':
        return 'border-red-500/30';
      case 'success':
        return 'border-green-500/30';
      default:
        return 'border-blue-500/30';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`relative bg-gradient-to-r ${getGradient()} border-b ${getBorderColor()} backdrop-blur-md`}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="flex-shrink-0"
            >
              {getIcon()}
            </motion.div>
            <p className="text-white font-semibold text-base md:text-lg text-center">
              {announcement.message}
            </p>
          </motion.div>
        </div>

        {/* Bottom glow effect */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${getBorderColor()} opacity-50`} />
      </motion.div>
    </AnimatePresence>
  );
}
