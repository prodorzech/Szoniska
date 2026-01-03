'use client';

import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import type { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const totalMedia = post.images.length + (post.videos?.length || 0);
  const hasVideos = post.videos && post.videos.length > 0;
  const hasImages = post.images.length > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-xl overflow-hidden cursor-pointer shadow-xl shadow-purple-500/10 hover:shadow-purple-500/30 transition-all"
    >
      {totalMedia > 0 && (
        <div className="relative h-56 overflow-hidden">
          {hasVideos ? (
            <video
              src={post.videos[0]}
              className="w-full h-full object-cover"
              muted
            />
          ) : (
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          )}
          {totalMedia > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded-full text-sm">
              +{totalMedia - 1} więcej
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          {post.user.image ? (
            <img
              src={post.user.image}
              alt={post.user.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              {post.user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-white">{post.user.name}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString('pl-PL')}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
          {post.description}
        </p>

        {post.editedAt && (
          <p className="text-xs text-gray-500 mb-3">
            Edytowano: {new Date(post.editedAt).toLocaleDateString('pl-PL')}
          </p>
        )}

        <div className="flex gap-3">
          {post.facebookUrl && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={post.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaFacebook size={18} />
            </motion.a>
          )}
          {post.instagramUrl && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={post.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              <FaInstagram size={18} />
            </motion.a>
          )}
          {post.tiktokUrl && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={post.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 flex items-center justify-center bg-black rounded-lg hover:bg-gray-900 transition-colors border border-white"
            >
              <FaTiktok size={16} />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
