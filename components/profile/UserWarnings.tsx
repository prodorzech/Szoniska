'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaCalendarAlt, FaCheckCircle, FaBan } from 'react-icons/fa';

interface Warning {
  id: string;
  message: string;
  createdAt: string;
}

interface User {
  isBlocked: boolean;
  isRestricted: boolean;
}

export default function UserWarnings() {
  const { data: session } = useSession();
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [warningsRes, statsRes] = await Promise.all([
        fetch('/api/user/warnings'),
        fetch('/api/user/stats'),
      ]);
      
      if (warningsRes.ok) {
        const warningsData = await warningsRes.json();
        setWarnings(warningsData);
      }
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setUser({
          isBlocked: statsData.isBlocked,
          isRestricted: statsData.isRestricted,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccountStatus = () => {
    const count = warnings.length;
    
    if (user?.isBlocked || count >= 8) {
      return {
        label: 'Zablokowane',
        description: 'Twoje konto jest zablokowane. Nie możesz przeglądać, tworzyć ani edytować postów.',
        color: 'red',
        icon: FaBan,
        bgClass: 'from-red-900/50 to-red-800/30',
        borderClass: 'border-red-500',
        textClass: 'text-red-400',
      };
    }
    
    if (user?.isRestricted || count >= 4) {
      return {
        label: 'Ograniczone',
        description: 'Twoje konto ma ograniczenia. Nie możesz tworzyć ani edytować postów ani komentarzy.',
        color: 'orange',
        icon: FaExclamationTriangle,
        bgClass: 'from-orange-900/50 to-orange-800/30',
        borderClass: 'border-orange-500',
        textClass: 'text-orange-400',
      };
    }
    
    return {
      label: 'W porządku',
      description: 'Twoje konto działa normalnie. Nie masz żadnych ograniczeń.',
      color: 'green',
      icon: FaCheckCircle,
      bgClass: 'from-green-900/50 to-green-800/30',
      borderClass: 'border-green-500',
      textClass: 'text-green-400',
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (warnings.length === 0 && !user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
          <FaExclamationTriangle size={48} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Brak ostrzeżeń!</h3>
        <p className="text-gray-400">
          Świetnie się spisujesz. Nie masz żadnych ostrzeżeń od administracji.
        </p>
      </motion.div>
    );
  }

  const status = getAccountStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Account Status Banner - Discord Style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${status.bgClass} border-2 ${status.borderClass} rounded-xl p-6 shadow-lg`}
      >
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-16 h-16 bg-${status.color}-500/20 rounded-full flex items-center justify-center`}>
            <StatusIcon size={32} className={status.textClass} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">
                Twoje konto jest <span className={status.textClass}>{status.label}</span>
              </h2>
            </div>
            <p className="text-gray-300 mb-3">
              {status.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="px-3 py-1 bg-black/30 rounded-lg">
                <span className="text-gray-400">Ostrzeżenia: </span>
                <span className={`font-bold ${status.textClass}`}>{warnings.length}</span>
              </div>
              {warnings.length > 0 && (
                <div className="px-3 py-1 bg-black/30 rounded-lg">
                  <span className="text-gray-400">Status: </span>
                  <span className={`font-bold ${status.textClass}`}>
                    {warnings.length >= 8 ? 'Zablokowane' : warnings.length >= 4 ? 'Ograniczone' : 'W porządku'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {warnings.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Historia ostrzeżeń</h3>
            <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
              <span className="text-red-400 font-semibold">
                Łącznie: {warnings.length}
              </span>
            </div>
          </div>

          {warnings.map((warning, index) => (
            <motion.div
              key={warning.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/30 rounded-xl p-5 hover:border-red-500/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle size={24} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Ostrzeżenie od administracji
                  </h3>
                  <p className="text-gray-300 mb-3 leading-relaxed">
                    {warning.message}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FaCalendarAlt size={14} />
                    <span>
                      {new Date(warning.createdAt).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {warnings.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <FaExclamationTriangle size={24} className="text-yellow-500" />
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-1">
                    Uwaga!
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Masz już {warnings.length} ostrzeżenia. Kolejne naruszenia regulaminu mogą skutkować blokadą konta.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}