'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AuthLoading() {
  const [message, setMessage] = useState('Weryfikowanie...');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('Logowanie...');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-6 border-4 border-purple-500 border-t-transparent rounded-full"
        />
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl text-purple-300 font-medium"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}
