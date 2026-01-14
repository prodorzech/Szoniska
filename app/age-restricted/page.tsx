'use client';

import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function AgeRestrictedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl shadow-purple-500/20"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50"
          >
            <FaExclamationTriangle className="text-white text-5xl" />
          </motion.div>
        </div>

        {/* Tytuł */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 text-center mb-4">
          Dostęp Ograniczony
        </h1>

        {/* Opis */}
        <div className="space-y-4 text-gray-300 text-center mb-8">
          <p className="text-xl">
            Ta strona zawiera treści przeznaczone wyłącznie dla osób pełnoletnich.
          </p>
          <p className="text-lg">
            Musisz mieć ukończone <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">18 lat</span>, aby uzyskać dostęp do tej witryny.
          </p>
        </div>

        {/* Dodatkowe informacje */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-3">Dlaczego to ograniczenie?</h2>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Strona może zawierać treści nieodpowiednie dla osób niepełnoletnich</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Obowiązujące przepisy prawne wymagają weryfikacji wieku</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Chronimy młodszych użytkowników przed nieodpowiednimi treściami</span>
            </li>
          </ul>
        </div>

        {/* Informacja końcowa */}
        <p className="text-sm text-gray-500 text-center">
          Jeśli masz ukończone 18 lat i chcesz uzyskać dostęp, odśwież stronę i potwierdź swój wiek.
        </p>
      </motion.div>
    </div>
  );
}
