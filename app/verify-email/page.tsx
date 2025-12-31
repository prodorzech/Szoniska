'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!token || token.length !== 6) {
      setError('Wprowadź 6-cyfrowy kod');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: emailParam }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Nieprawidłowy kod');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push(`/login?email=${encodeURIComponent(emailParam || '')}`), 3000);
    } catch (err) {
      setError('Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
          {!success ? (
            <>
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Potwierdź swój email
              </h1>
              <p className="text-gray-400 text-center mb-8">
                Wysłaliśmy kod weryfikacyjny na adres:<br />
                <span className="text-purple-400 font-semibold">{emailParam}</span>
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                  <FaTimesCircle />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Kod weryfikacyjny
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-gray-800 text-white text-center text-2xl font-bold tracking-widest rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="000000"
                    maxLength={6}
                  />
                  <p className="text-gray-500 text-sm mt-2 text-center">
                    Wprowadź 6-cyfrowy kod z emaila
                  </p>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={loading || token.length !== 6}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {loading ? 'Weryfikowanie...' : 'Potwierdź email'}
                </button>
              </div>

              <p className="text-gray-400 text-center mt-6 text-sm">
                Nie otrzymałeś kodu?{' '}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
                  Wyślij ponownie
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="inline-block mb-4"
              >
                <FaCheckCircle className="text-green-500 text-6xl" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Email zweryfikowany!
              </h2>
              <p className="text-gray-400 mb-6">
                Twoje konto zostało aktywowane. Przekierowywanie do logowania...
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
