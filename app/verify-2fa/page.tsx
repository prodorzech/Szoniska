'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaTimesCircle } from 'react-icons/fa';

function Verify2FAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const provider = searchParams.get('provider');
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      router.push('/');
    }
  }, [userId, router]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Wprowadź 6-cyfrowy kod');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-2fa-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Nieprawidłowy kod');
        return;
      }

      // Zapisz token w localStorage i przekieruj
      localStorage.setItem('2fa_temp_token', data.token);
      router.push(`/?2fa_complete=1&userId=${userId}`);
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
          <div className="flex flex-col items-center mb-6">
            <div className="bg-purple-600 p-4 rounded-full mb-4">
              <FaShieldAlt className="text-white text-4xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              Weryfikacja dwuetapowa
            </h1>
            <p className="text-gray-400 text-center">
              Wprowadź kod z aplikacji Google Authenticator
            </p>
          </div>

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
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-gray-800 text-white text-center text-2xl font-bold tracking-widest rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
              <p className="text-gray-500 text-sm mt-2 text-center">
                Wprowadź 6-cyfrowy kod z aplikacji
              </p>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || code.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {loading ? 'Weryfikowanie...' : 'Potwierdź i zaloguj'}
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Anuluj
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Verify2FAPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center"><div className="text-white text-xl">Ładowanie...</div></div>}>
      <Verify2FAContent />
    </Suspense>
  );
}
