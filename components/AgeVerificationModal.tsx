'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AgeVerificationModal() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Sprawdź czy użytkownik już potwierdził wiek lub jest na stronie age-restricted
    const ageVerified = localStorage.getItem('ageVerified');
    const ageRestricted = localStorage.getItem('ageRestricted');
    const isOnRestrictedPage = window.location.pathname === '/age-restricted';
    
    if (!ageVerified && !ageRestricted && !isOnRestrictedPage) {
      setShow(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('ageVerified', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('ageRestricted', 'true');
    setShow(false);
    router.push('/age-restricted');
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-purple-500/20"
        >
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              18+
            </div>
          </div>

          {/* Tytuł */}
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 text-center mb-4">
            Weryfikacja Wieku
          </h2>

          {/* Opis */}
          <p className="text-gray-300 text-center mb-8">
            Ta strona zawiera treści przeznaczone wyłącznie dla osób pełnoletnich.
            Aby kontynuować, potwierdź, że masz ukończone 18 lat.
          </p>

          {/* Przyciski */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30"
            >
              Tak, mam ukończone 18 lat
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDecline}
              className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all border border-gray-600"
            >
              Nie, nie mam ukończonych 18 lat
            </motion.button>
          </div>

          {/* Informacja dodatkowa */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Klikając "Tak", potwierdzasz, że masz ukończone 18 lat i akceptujesz dostęp do treści dla dorosłych.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
