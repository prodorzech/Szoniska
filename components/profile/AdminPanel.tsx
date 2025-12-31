'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCheckCircle, FaComments } from 'react-icons/fa';
import VerificationPanel from './VerificationPanel';
import UsersManagement from './UsersManagement';
import ChatManagement from '../admin/ChatManagement';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'verification' | 'users' | 'chat'>('verification');

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('verification')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all ${
            activeTab === 'verification'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
              : 'bg-gray-800/50 text-gray-400 hover:text-white'
          }`}
        >
          <FaCheckCircle size={20} />
          Weryfikowanie
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
              : 'bg-gray-800/50 text-gray-400 hover:text-white'
          }`}
        >
          <FaUsers size={20} />
          Użytkownicy
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all ${
            activeTab === 'chat'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
              : 'bg-gray-800/50 text-gray-400 hover:text-white'
          }`}
        >
          <FaComments size={20} />
          Chat
        </motion.button>
      </div>

      {activeTab === 'verification' && <VerificationPanel />}
      {activeTab === 'users' && <UsersManagement />}
      {activeTab === 'chat' && <ChatManagement />}
    </div>
  );
}
