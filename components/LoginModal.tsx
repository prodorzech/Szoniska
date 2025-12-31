'use client';

import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDiscord, FaGoogle, FaTimes } from 'react-icons/fa';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-purple-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>

          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Witaj w Szoniska!
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Zaloguj się, aby kontynuować
          </p>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn('discord', { callbackUrl: '/auth/callback' })}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-lg shadow-lg shadow-[#5865F2]/30 transition-all"
            >
              <FaDiscord size={24} />
              Zaloguj się przez Discord
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn('google', { callbackUrl: '/auth/callback' })}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg shadow-lg shadow-white/20 transition-all"
            >
              <FaGoogle size={24} />
              Zaloguj się przez Google
            </motion.button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Logując się, akceptujesz nasze{' '}
              <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                warunki korzystania
              </span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
