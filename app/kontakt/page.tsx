'use client';

import Link from 'next/link';
import { FaArrowLeft, FaDiscord, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
          >
            <FaArrowLeft /> Powrót do strony głównej
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/20 p-8 shadow-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Kontakt
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-gray-400 mb-8"
          >
            Masz pytania? Skontaktuj się z nami!
          </motion.p>

          <div className="space-y-8">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <FaDiscord size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Discord</h2>
                  <p className="text-gray-400">Najszybszy sposób kontaktu</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Dołącz do naszego serwera Discord, aby zadać pytanie lub zgłosić problem. 
                Nasz zespół moderatorów jest tam dostępny i chętnie pomoże!
              </p>
              <a
                href="https://discord.gg/szoniska"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                <FaDiscord /> Dołącz do Discorda
              </a>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaEnvelope size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">E-mail</h2>
                  <p className="text-gray-400">Oficjalny kanał komunikacji</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                W sprawach formalnych lub bardziej szczegółowych możesz napisać do nas na e-mail.
              </p>
              <a
                href="mailto:kontakt@szoniska.pl"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <FaEnvelope /> kontakt@szoniska.pl
              </a>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Najczęściej zadawane pytania</h2>
              <div className="space-y-4">
                <details className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                  <summary className="text-white font-semibold cursor-pointer">
                    Jak mogę zgłosić nieodpowiednią treść?
                  </summary>
                  <p className="text-gray-300 mt-3">
                    Skontaktuj się z administratorami poprzez Discord lub użyj funkcji zgłaszania dostępnej przy postach i komentarzach.
                  </p>
                </details>

                <details className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                  <summary className="text-white font-semibold cursor-pointer">
                    Dlaczego mój post nie został zaakceptowany?
                  </summary>
                  <p className="text-gray-300 mt-3">
                    Wszystkie posty przechodzą moderację. Jeśli Twój post został odrzucony, prawdopodobnie naruszał regulamin. 
                    W razie wątpliwości skontaktuj się z moderatorami.
                  </p>
                </details>

                <details className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                  <summary className="text-white font-semibold cursor-pointer">
                    Jak mogę usunąć swoje konto?
                  </summary>
                  <p className="text-gray-300 mt-3">
                    Możesz usunąć konto w ustawieniach profilu. Pamiętaj, że ta operacja jest nieodwracalna i wszystkie Twoje dane zostaną trwale usunięte.
                  </p>
                </details>

                <details className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                  <summary className="text-white font-semibold cursor-pointer">
                    Otrzymałem ostrzeżenie - co teraz?
                  </summary>
                  <p className="text-gray-300 mt-3">
                    Ostrzeżenia są wydawane za naruszenie regulaminu. Zapoznaj się z powodem ostrzeżenia i staraj się przestrzegać zasad w przyszłości. 
                    W razie pytań skontaktuj się z moderatorami.
                  </p>
                </details>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
