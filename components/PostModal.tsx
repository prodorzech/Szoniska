'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import CommentSection from './CommentSection';
import type { Post } from '@/types/post';

interface PostModalProps {
  post: Post;
  onClose: () => void;
  onUpdate: () => void;
}

export default function PostModal({ post, onClose, onUpdate }: PostModalProps) {
  const { data: session } = useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && post.images.length > 0) prevImage();
      if (e.key === 'ArrowRight' && post.images.length > 0) nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white bg-black/50 p-2 rounded-full backdrop-blur-sm transition-colors"
          >
            <FaTimes size={24} />
          </button>

          <div className="overflow-y-auto max-h-[90vh]">
            <div className="flex flex-col lg:flex-row">
              {/* Galeria zdjęć - lewa strona */}
              {post.images.length > 0 && (
                <div className="lg:w-1/2 relative bg-black">
                  <div className="relative aspect-square">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={post.images[currentImageIndex]}
                        alt={`${post.title} - obraz ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>

                    {post.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                        >
                          <FaChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                        >
                          <FaChevronRight size={24} />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm">
                          <span className="text-white text-sm">
                            {currentImageIndex + 1} / {post.images.length}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Miniaturki */}
                  {post.images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2 p-4 bg-black/50">
                      {post.images.map((img, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentImageIndex
                              ? 'border-purple-500'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Miniatura ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Treść posta - prawa strona */}
              <div className={`${post.images.length > 0 ? 'lg:w-1/2' : 'w-full'} p-6 flex flex-col`}>
                <div className="flex items-center gap-3 mb-4">
                  {post.user.image ? (
                    <img
                      src={post.user.image}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {post.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white text-lg">{post.user.name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('pl-PL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">{post.title}</h2>
                <p className="text-gray-300 mb-6 whitespace-pre-wrap">{post.description}</p>

                {post.editedAt && (
                  <p className="text-sm text-gray-500 mb-4">
                    Edytowano: {new Date(post.editedAt).toLocaleDateString('pl-PL')}
                  </p>
                )}

                {(post.facebookUrl || post.instagramUrl || post.tiktokUrl) && (
                  <div className="flex gap-3 mb-6">
                    {post.facebookUrl && (
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={post.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaFacebook size={20} />
                        <span className="text-sm font-medium">Facebook</span>
                      </motion.a>
                    )}
                    {post.instagramUrl && (
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={post.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                      >
                        <FaInstagram size={20} />
                        <span className="text-sm font-medium">Instagram</span>
                      </motion.a>
                    )}
                    {post.tiktokUrl && (
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={post.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-black rounded-lg hover:bg-gray-900 transition-colors border border-white"
                      >
                        <FaTiktok size={18} />
                        <span className="text-sm font-medium">TikTok</span>
                      </motion.a>
                    )}
                  </div>
                )}

                <div className="border-t border-purple-500/30 pt-6 mt-auto">
                  <CommentSection postId={post.id} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
