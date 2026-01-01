'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from './LoginModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Header() {
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-900/50"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Image
                  src="/logo.png"
                  alt="Szoniska Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  Szoniska
                </h1>
              </motion.div>
            </Link>

            <nav className="flex items-center gap-6">
              {session ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/30 transition-all"
                  >
                    {session.user?.image && (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-white font-medium">
                      {session.user?.name || 'Profil'}
                    </span>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        {/* Overlay to close menu */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                        />
                        
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg border border-purple-500/30 shadow-xl shadow-purple-500/20 overflow-hidden z-50"
                        >
                          <Link href="/profile">
                            <motion.div
                              whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-white hover:text-purple-400 transition-colors cursor-pointer"
                            >
                              <FaUser />
                              <span>Profil</span>
                            </motion.div>
                          </Link>
                          
                          <motion.button
                            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:text-red-400 transition-colors border-t border-purple-500/30"
                          >
                            <FaSignOutAlt />
                            <span>Wyloguj się</span>
                          </motion.button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/50 transition-all"
                  >
                    Zaloguj się
                  </motion.button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </motion.header>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
