'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function RegulaminPage() {
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
            Regulamin
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-gray-400 mb-8"
          >
            Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
          </motion.p>

          <div className="space-y-8 text-gray-300">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">1. Postanowienia ogólne</h2>
              <div className="space-y-3">
                <p>1.1. Niniejszy regulamin określa zasady korzystania z platformy Szoniska (dalej: "Platforma").</p>
                <p>1.2. Platforma jest przeznaczona dla osób uczęszczających do określonej szkoły.</p>
                <p>1.3. Korzystanie z Platformy oznacza akceptację niniejszego regulaminu.</p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">2. Rejestracja i konto użytkownika</h2>
              <div className="space-y-3">
                <p>2.1. Rejestracja na Platformie wymaga posiadania konta Discord.</p>
                <p>2.2. Użytkownik zobowiązuje się podać prawdziwe dane podczas rejestracji.</p>
                <p>2.3. Użytkownik jest odpowiedzialny za zachowanie poufności danych dostępowych do swojego konta.</p>
                <p>2.4. Zabrania się udostępniania konta innym osobom.</p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">3. Zasady publikowania treści</h2>
              <div className="space-y-3">
                <p>3.1. Użytkownik może publikować posty, komentarze i inne treści zgodne z regulaminem.</p>
                <p>3.2. Zabrania się publikowania treści:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Naruszających prawo polskie lub międzynarodowe</li>
                  <li>Obraźliwych, wulgarnych lub nieprzyzwoitych</li>
                  <li>Propagujących przemoc, nienawiść lub dyskryminację</li>
                  <li>Naruszających prywatność lub dobre imię innych osób</li>
                  <li>Zawierających spam lub niepożądane reklamy</li>
                  <li>Łamiących prawa autorskie</li>
                </ul>
                <p>3.3. Wszystkie posty przed publikacją przechodzą proces weryfikacji przez administratorów.</p>
                <p>3.4. Administratorzy mają prawo do odrzucenia lub usunięcia treści niezgodnych z regulaminem.</p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">4. Prawa i obowiązki użytkowników</h2>
              <div className="space-y-3">
                <p>4.1. Użytkownik ma prawo do:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Publikowania treści zgodnych z regulaminem</li>
                  <li>Komentowania postów innych użytkowników</li>
                  <li>Edycji i usuwania własnych treści</li>
                  <li>Usunięcia swojego konta</li>
                </ul>
                <p>4.2. Użytkownik zobowiązuje się do:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Przestrzegania niniejszego regulaminu</li>
                  <li>Szanowania innych użytkowników</li>
                  <li>Nieużywania Platformy w celach niezgodnych z jej przeznaczeniem</li>
                </ul>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">5. System ostrzeżeń i konsekwencje</h2>
              <div className="space-y-3">
                <p>5.1. Za naruszenie regulaminu użytkownik może otrzymać ostrzeżenie.</p>
                <p>5.2. Administratorzy mogą nałożyć następujące sankcje:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Ostrzeżenie (przypomnienie o zasadach)</li>
                  <li>Ograniczenie dostępu do funkcji Platformy</li>
                  <li>Czasowe zawieszenie konta</li>
                  <li>Trwałe zablokowanie konta</li>
                </ul>
                <p>5.3. Decyzja o nałożeniu sankcji należy do administratorów.</p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">6. Odpowiedzialność</h2>
              <div className="space-y-3">
                <p>6.1. Platforma nie ponosi odpowiedzialności za treści publikowane przez użytkowników.</p>
                <p>6.2. Użytkownik ponosi pełną odpowiedzialność za publikowane przez siebie treści.</p>
                <p>6.3. Platforma zastrzega sobie prawo do czasowej niedostępności serwisu z powodu konserwacji lub awarii.</p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">7. Ochrona danych osobowych</h2>
              <div className="space-y-3">
                <p>7.1. Zasady przetwarzania danych osobowych określa oddzielna <Link href="/polityka-prywatnosci" className="text-purple-400 hover:text-purple-300 underline">Polityka Prywatności</Link>.</p>
                <p>7.2. Platforma przetwarza dane użytkowników zgodnie z RODO.</p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">8. Zmiany regulaminu</h2>
              <div className="space-y-3">
                <p>8.1. Administratorzy zastrzegają sobie prawo do zmiany regulaminu.</p>
                <p>8.2. O zmianach użytkownicy zostaną poinformowani za pośrednictwem Platformy.</p>
                <p>8.3. Dalsze korzystanie z Platformy po wprowadzeniu zmian oznacza akceptację nowego regulaminu.</p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">9. Postanowienia końcowe</h2>
              <div className="space-y-3">
                <p>9.1. W sprawach nieuregulowanych w regulaminie zastosowanie mają przepisy prawa polskiego.</p>
                <p>9.2. W przypadku pytań dotyczących regulaminu należy skontaktować się z administratorami.</p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
