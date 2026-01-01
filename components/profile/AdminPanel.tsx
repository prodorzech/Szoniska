'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCheckCircle, FaComments, FaBullhorn, FaTools } from 'react-icons/fa';
import VerificationPanel from './VerificationPanel';
import UsersManagementNew from './UsersManagementNew';
import ChatManagement from '../admin/ChatManagement';
import UpdatesManagement from './UpdatesManagement';
import TechnicalManagement from './TechnicalManagement';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'verification' | 'users' | 'chat' | 'updates' | 'technical'>('verification');

  return (
    <div>
      <div className="overflow-x-auto mb-6">
        <div className="flex gap-4 min-w-max">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('verification')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all whitespace-nowrap ${
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
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all whitespace-nowrap ${
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
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <FaComments size={20} />
            Chat
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('updates')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'updates'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <FaBullhorn size={20} />
            Aktualizacje
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('technical')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'technical'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <FaTools size={20} />
            Techniczne
          </motion.button>
        </div>
      </div>

      {activeTab === 'verification' && <VerificationPanel />}
      {activeTab === 'users' && <UsersManagementNew />}
      {activeTab === 'chat' && <ChatManagement />}
      {activeTab === 'updates' && <UpdatesManagement />}
      {activeTab === 'technical' && <TechnicalManagement />}
    </div>
  );
}
