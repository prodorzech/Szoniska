'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaDiscord, FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '', twoFactorCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials: any = {
        email: formData.email,
        password: formData.password,
        redirect: false,
      };

      // Dodaj kod 2FA tylko jeśli jest wypełniony
      if (formData.twoFactorCode && formData.twoFactorCode.length === 6) {
        credentials.twoFactorCode = formData.twoFactorCode;
      }

      const result = await signIn('credentials', credentials);

      if (result?.error) {
        if (result.error === '2FA_REQUIRED') {
          setShow2FA(true);
          setError('');
        } else {
          setError(result.error);
        }
      } else {
        router.push('/');
        router.refresh();
      }
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
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Witaj ponownie!
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Zaloguj się do swojego konta
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="twoj@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-300 text-sm font-semibold">Hasło</label>
                <Link 
                  href="/forgot-password"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Nie pamiętam hasła
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Twoje hasło"
                  required
                />
              </div>
            </div>

            {show2FA && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Kod weryfikacyjny 2FA
                </label>
                <input
                  type="text"
                  value={formData.twoFactorCode}
                  onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  className="w-full bg-gray-800 text-white text-center text-2xl font-bold tracking-widest rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
                <p className="text-gray-500 text-sm mt-2 text-center">
                  Wprowadź 6-cyfrowy kod z Google Authenticator
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Logowanie...' : (<>Zaloguj się <FaArrowRight /></>)}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Lub zaloguj się przez</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => signIn('discord', { callbackUrl: '/' })}
              className="flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 rounded-lg transition-colors"
            >
              <FaDiscord size={20} />
              Discord
            </button>
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
            >
              <FaGoogle size={18} />
              Google
            </button>
          </div>

          <p className="text-gray-400 text-center mt-6">
            Nie masz konta?{' '}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Ładowanie...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
