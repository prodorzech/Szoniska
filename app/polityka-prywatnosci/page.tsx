'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function PolitykaPrywatnosciPage() {
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
            Polityka Prywatności
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
              <h2 className="text-2xl font-bold text-white mb-4">1. Informacje ogólne</h2>
              <div className="space-y-3">
                <p>1.1. Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych użytkowników platformy Szoniska.</p>
                <p>1.2. Administratorem danych osobowych jest operator platformy Szoniska.</p>
                <p>1.3. Dane osobowe przetwarzane są zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).</p>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-white mb-4">2. Zakres zbieranych danych</h2>
              <div className="space-y-3">
                <p>2.1. W związku z korzystaniem z Platformy zbierane są następujące dane:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Dane z konta Discord (nazwa użytkownika, adres e-mail, identyfikator Discord, zdjęcie profilowe)</li>
                  <li>Treści publikowane przez użytkownika (posty, komentarze)</li>
                  <li>Dane techniczne (adres IP, typ przeglądarki, czas korzystania z Platformy)</li>
                  <li>Dane o aktywności (logi, historia działań)</li>
                </ul>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-white mb-4">3. Cel przetwarzania danych</h2>
              <div className="space-y-3">
                <p>3.1. Dane osobowe przetwarzane są w następujących celach:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Umożliwienie korzystania z funkcji Platformy</li>
                  <li>Identyfikacja użytkownika</li>
                  <li>Moderacja treści i egzekwowanie regulaminu</li>
                  <li>Komunikacja z użytkownikami</li>
                  <li>Zapewnienie bezpieczeństwa Platformy</li>
                  <li>Analiza i ulepszanie funkcjonalności</li>
                  <li>Wypełnienie obowiązków prawnych</li>
                </ul>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-white mb-4">4. Podstawa prawna przetwarzania</h2>
              <div className="space-y-3">
                <p>4.1. Dane przetwarzane są na podstawie:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Zgody użytkownika (art. 6 ust. 1 lit. a RODO)</li>
                  <li>Niezbędności do wykonania umowy (art. 6 ust. 1 lit. b RODO)</li>
                  <li>Prawnie uzasadnionego interesu administratora (art. 6 ust. 1 lit. f RODO)</li>
                </ul>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-white mb-4">5. Okres przechowywania danych</h2>
              <div className="space-y-3">
                <p>5.1. Dane osobowe przechowywane są przez okres:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Korzystania z Platformy przez użytkownika</li>
                  <li>Niezbędny do realizacji celów, dla których zostały zebrane</li>
                  <li>Wymagany przepisami prawa</li>
                </ul>
                <p>5.2. Po usunięciu konta dane są trwale usuwane z wyjątkiem przypadków wymaganych przez prawo.</p>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-white mb-4">6. Udostępnianie danych</h2>
              <div className="space-y-3">
                <p>6.1. Dane osobowe mogą być udostępniane:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Dostawcom usług technicznych (hosting, bazy danych)</li>
                  <li>Organom państwowym na podstawie przepisów prawa</li>
                </ul>
                <p>6.2. Dane nie są sprzedawane ani przekazywane osobom trzecim w celach marketingowych.</p>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0, duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-white mb-4">7. Prawa użytkowników</h2>
              <div className="space-y-3">
                <p>7.1. Użytkownik ma prawo do:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Dostępu do swoich danych osobowych</li>
                  <li>Sprostowania (poprawiania) danych</li>
                  <li>Usunięcia danych ("prawo do bycia zapomnianym")</li>
                  <li>Ograniczenia przetwarzania danych</li>
                  <li>Przenoszenia danych</li>
                  <li>Wniesienia sprzeciwu wobec przetwarzania</li>
                  <li>Cofnięcia zgody w dowolnym momencie</li>
                  <li>Wniesienia skargi do organu nadzorczego (UODO)</li>
                </ul>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-white mb-4">8. Cookies i technologie śledzące</h2>
              <div className="space-y-3">
                <p>8.1. Platforma wykorzystuje pliki cookies i podobne technologie.</p>
                <p>8.2. Cookies służą do:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Zapamiętywania sesji użytkownika</li>
                  <li>Zapewnienia prawidłowego działania Platformy</li>
                  <li>Analizy ruchu na stronie</li>
                </ul>
                <p>8.3. Użytkownik może zarządzać cookies w ustawieniach przeglądarki.</p>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-white mb-4">9. Bezpieczeństwo danych</h2>
              <div className="space-y-3">
                <p>9.1. Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo danych.</p>
                <p>9.2. Stosowane zabezpieczenia obejmują:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Szyfrowanie połączeń (HTTPS/SSL)</li>
                  <li>Zabezpieczenia serwerów i baz danych</li>
                  <li>Regularne kopie zapasowe</li>
                  <li>Kontrolę dostępu do danych</li>
                </ul>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-white mb-4">10. Zmiany w Polityce Prywatności</h2>
              <div className="space-y-3">
                <p>10.1. Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności.</p>
                <p>10.2. O istotnych zmianach użytkownicy zostaną poinformowani za pośrednictwem Platformy.</p>
                <p>10.3. Bieżąca wersja Polityki Prywatności jest zawsze dostępna na stronie.</p>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-white mb-4">11. Kontakt</h2>
              <div className="space-y-3">
                <p>11.1. W sprawach dotyczących ochrony danych osobowych można kontaktować się poprzez:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Formularz kontaktowy na Platformie</li>
                  <li>Serwer Discord społeczności</li>
                </ul>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

