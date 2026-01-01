'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaShieldAlt, FaQrcode, FaCheckCircle, FaTimesCircle, FaCopy } from 'react-icons/fa';
import Image from 'next/image';

export default function SecuritySettings() {
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorMessage, setTwoFactorMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Pobierz status 2FA przy montowaniu komponentu
  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const response = await fetch('/api/user/2fa-status');
        const data = await response.json();
        if (response.ok) {
          setTwoFactorEnabled(data.twoFactorEnabled);
        }
      } catch (error) {
        console.error('Błąd pobierania statusu 2FA:', error);
      }
    };

    fetch2FAStatus();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Nowe hasła nie pasują do siebie' });
      return;
    }

    if (changePasswordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Hasło musi mieć minimum 6 znaków' });
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: changePasswordForm.currentPassword,
          newPassword: changePasswordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordMessage({ type: 'error', text: data.error });
      } else {
        setPasswordMessage({ type: 'success', text: data.message });
        setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Wystąpił błąd' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleStartTwoFactorSetup = async () => {
    setTwoFactorMessage(null);
    setTwoFactorLoading(true);

    try {
      const response = await fetch('/api/user/2fa');
      const data = await response.json();

      if (!response.ok) {
        setTwoFactorMessage({ type: 'error', text: data.error });
      } else {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setShowTwoFactorSetup(true);
      }
    } catch (error) {
      setTwoFactorMessage({ type: 'error', text: 'Wystąpił błąd' });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (verificationCode.length !== 6) {
      setTwoFactorMessage({ type: 'error', text: 'Kod musi mieć 6 cyfr' });
      return;
    }

    setTwoFactorLoading(true);
    setTwoFactorMessage(null);

    try {
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verificationCode,
          secret,
          action: 'enable',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTwoFactorMessage({ type: 'error', text: data.error });
      } else {
        setTwoFactorMessage({ type: 'success', text: data.message });
        setTwoFactorEnabled(true);
        setShowTwoFactorSetup(false);
        setVerificationCode('');
      }
    } catch (error) {
      setTwoFactorMessage({ type: 'error', text: 'Wystąpił błąd' });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (verificationCode.length !== 6) {
      setTwoFactorMessage({ type: 'error', text: 'Kod musi mieć 6 cyfr' });
      return;
    }

    setTwoFactorLoading(true);
    setTwoFactorMessage(null);

    try {
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verificationCode,
          action: 'disable',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTwoFactorMessage({ type: 'error', text: data.error });
      } else {
        setTwoFactorMessage({ type: 'success', text: data.message });
        setTwoFactorEnabled(false);
        setVerificationCode('');
      }
    } catch (error) {
      setTwoFactorMessage({ type: 'error', text: 'Wystąpił błąd' });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const copySecretToClipboard = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Zmiana hasła */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaLock className="text-purple-400 text-2xl" />
          <h2 className="text-2xl font-bold text-white">Zmiana hasła</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Aktualne hasło
            </label>
            <input
              type="password"
              value={changePasswordForm.currentPassword}
              onChange={(e) =>
                setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })
              }
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Wprowadź aktualne hasło"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Nowe hasło</label>
            <input
              type="password"
              value={changePasswordForm.newPassword}
              onChange={(e) =>
                setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })
              }
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Minimum 6 znaków"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Potwierdź nowe hasło
            </label>
            <input
              type="password"
              value={changePasswordForm.confirmPassword}
              onChange={(e) =>
                setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })
              }
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Wprowadź ponownie nowe hasło"
              required
            />
          </div>

          {passwordMessage && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                passwordMessage.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                  : 'bg-red-500/10 border border-red-500/50 text-red-400'
              }`}
            >
              {passwordMessage.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
              {passwordMessage.text}
            </div>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            {passwordLoading ? 'Zmieniam...' : 'Zmień hasło'}
          </button>
        </form>
      </motion.div>

      {/* Weryfikacja dwuetapowa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaShieldAlt className="text-purple-400 text-2xl" />
          <h2 className="text-2xl font-bold text-white">Weryfikacja dwuetapowa (2FA)</h2>
        </div>

        <p className="text-gray-400 mb-6">
          Zabezpiecz swoje konto dodając dodatkową warstwę ochrony. Użyj aplikacji Google
          Authenticator lub innej aplikacji TOTP.
        </p>

        {!twoFactorEnabled && !showTwoFactorSetup && (
          <button
            onClick={handleStartTwoFactorSetup}
            disabled={twoFactorLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <FaQrcode />
            {twoFactorLoading ? 'Ładowanie...' : 'Włącz weryfikację dwuetapową'}
          </button>
        )}

        {showTwoFactorSetup && !twoFactorEnabled && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg flex justify-center">
              <Image src={qrCode} alt="QR Code" width={200} height={200} />
            </div>

            {/* Klucz konfiguracyjny */}
            <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-2 text-center">
                Lub wprowadź klucz ręcznie:
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-900 rounded px-3 py-2 font-mono text-sm text-purple-400 break-all">
                  {secret}
                </div>
                <button
                  onClick={copySecretToClipboard}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2 whitespace-nowrap"
                  title="Skopiuj klucz"
                >
                  <FaCopy />
                  {copied ? 'Skopiowano!' : 'Kopiuj'}
                </button>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              Zeskanuj kod QR w aplikacji Google Authenticator, a następnie wprowadź 6-cyfrowy kod
              weryfikacyjny:
            </p>

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-gray-800 text-white text-center text-2xl font-bold tracking-widest rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="000000"
              maxLength={6}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTwoFactorSetup(false);
                  setVerificationCode('');
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Anuluj
              </button>
              <button
                onClick={handleEnable2FA}
                disabled={twoFactorLoading || verificationCode.length !== 6}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                {twoFactorLoading ? 'Weryfikowanie...' : 'Potwierdź i włącz'}
              </button>
            </div>
          </div>
        )}

        {twoFactorEnabled && (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg flex items-center gap-3">
              <FaCheckCircle className="text-2xl" />
              <div>
                <p className="font-semibold">Weryfikacja dwuetapowa jest włączona</p>
                <p className="text-sm">Twoje konto jest zabezpieczone</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              Aby wyłączyć weryfikację dwuetapową, wprowadź kod z aplikacji:
            </p>

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-gray-800 text-white text-center text-2xl font-bold tracking-widest rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="000000"
              maxLength={6}
            />

            <button
              onClick={handleDisable2FA}
              disabled={twoFactorLoading || verificationCode.length !== 6}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {twoFactorLoading ? 'Wyłączam...' : 'Wyłącz weryfikację dwuetapową'}
            </button>
          </div>
        )}

        {twoFactorMessage && (
          <div
            className={`mt-4 flex items-center gap-2 p-3 rounded-lg ${
              twoFactorMessage.type === 'success'
                ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                : 'bg-red-500/10 border border-red-500/50 text-red-400'
            }`}
          >
            {twoFactorMessage.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
            {twoFactorMessage.text}
          </div>
        )}
      </motion.div>
    </div>
  );
}
