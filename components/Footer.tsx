'use client';

import Link from 'next/link';
import { FaDiscord, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black border-t border-purple-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* O nas */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Szoniska</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platforma społecznościowa dla osób ze szkoły. Dziel się swoimi historiami, 
              poznawaj innych i bądź na bieżąco z wydarzeniami.
            </p>
          </div>

          {/* Linki */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Przydatne linki</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/regulamin" 
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Regulamin
                </Link>
              </li>
              <li>
                <Link 
                  href="/polityka-prywatnosci" 
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link 
                  href="/kontakt" 
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Społeczność</h3>
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://discord.gg/your-server"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white transition-colors"
                title="Discord"
              >
                <FaDiscord size={20} />
              </motion.a>
            </div>
            <p className="text-gray-400 text-sm mt-3">
              Dołącz do naszej społeczności na Discordzie!
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm flex items-center gap-2">
            © {currentYear} Szoniska. Wszystkie prawa zastrzeżone.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            Stworzone z <FaHeart className="text-red-500" /> dla społeczności
          </p>
        </div>
      </div>
    </footer>
  );
}
