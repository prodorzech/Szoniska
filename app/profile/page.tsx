'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaClipboardList, FaCog, FaShieldAlt, FaExclamationTriangle, FaLock, FaBullhorn } from 'react-icons/fa';
import ProfileInfo from '@/components/profile/ProfileInfo';
import UserPosts from '@/components/profile/UserPosts';
import AdminPanel from '@/components/profile/AdminPanel';
import UserWarnings from '@/components/profile/UserWarnings';
import SecuritySettings from '@/components/profile/SecuritySettings';
import UpdatesList from '@/components/profile/UpdatesList';
import EditProfileModal from '@/components/profile/EditProfileModal';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'posts' | 'warnings' | 'security' | 'updates' | 'admin'>('info');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  type TabType = 'info' | 'posts' | 'warnings' | 'security' | 'updates' | 'admin';

  const tabs: Array<{ id: TabType; label: string; icon: any }> = [
    { id: 'info', label: 'Profil', icon: FaUser },
    { id: 'posts', label: 'Posty', icon: FaClipboardList },
    { id: 'warnings', label: 'Ostrzeżenia', icon: FaExclamationTriangle },
    { id: 'security', label: 'Bezpieczeństwo', icon: FaLock },
    { id: 'updates', label: 'Aktualizacje', icon: FaBullhorn },
  ];

  if (session.user.isAdmin) {
    tabs.push({ id: 'admin', label: 'Panel', icon: FaShieldAlt });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl overflow-hidden shadow-xl shadow-purple-500/20"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-purple-600/30 p-6 border-b border-purple-500/30">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                onClick={() => setShowEditModal(true)}
                className="w-20 h-20 rounded-full border-4 border-purple-500 cursor-pointer hover:opacity-80 transition-opacity"
              />
            ) : (
              <div 
                onClick={() => setShowEditModal(true)}
                className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-purple-500 cursor-pointer hover:opacity-80 transition-opacity"
              >
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{session.user.name}</h1>
              {session.user.email && (
                <p className="text-purple-300">{session.user.email}</p>
              )}
              {session.user.isAdmin && (
                <span className="inline-block mt-2 px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                  Administrator
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto border-b border-purple-500/30">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600/20 text-purple-400 border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white hover:bg-purple-600/10'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'info' && <ProfileInfo />}
          {activeTab === 'posts' && <UserPosts />}
          {activeTab === 'warnings' && <UserWarnings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'updates' && <UpdatesList />}
          {activeTab === 'admin' && session.user.isAdmin && <AdminPanel />}
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            // Modal will update the session automatically
            console.log('Profile updated successfully');
          }}
        />
      )}
    </div>
  );
}
