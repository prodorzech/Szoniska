'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUpload, FaFacebook, FaInstagram, FaTiktok, FaVideo, FaImage } from 'react-icons/fa';

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [enableFacebook, setEnableFacebook] = useState(false);
  const [enableInstagram, setEnableInstagram] = useState(false);
  const [enableTiktok, setEnableTiktok] = useState(false);
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 10) {
      setError('Maksymalnie 10 zdjęć');
      return;
    }

    setImages([...images, ...files]);
    
    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (videos.length + files.length > 5) {
      setError('Maksymalnie 5 filmów');
      return;
    }

    setVideos([...videos, ...files]);
    
    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
    setVideoPreviews(videoPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Tytuł i opis są wymagane');
      return;
    }

    setSubmitting(true);

    try {
      // Upload images first
      const imageUrls: string[] = [];
      
      for (const image of images) {
        const formData = new FormData();
        formData.append('file', image);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        
        const { url } = await uploadRes.json();
        imageUrls.push(url);
      }

      // Upload videos
      const videoUrls: string[] = [];
      
      for (const video of videos) {
        const formData = new FormData();
        formData.append('file', video);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error('Failed to upload video');
        
        const { url } = await uploadRes.json();
        videoUrls.push(url);
      }

      // Create post
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          images: imageUrls,
          videos: videoUrls,
          facebookUrl: enableFacebook ? facebookUrl : null,
          instagramUrl: enableInstagram ? instagramUrl : null,
          tiktokUrl: enableTiktok ? tiktokUrl : null,
          isAnonymous,
        }),
      });

      if (!res.ok) throw new Error('Failed to create post');

      onSuccess();
    } catch (err) {
      setError('Wystąpił błąd podczas tworzenia posta');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>

          <h2 className="text-3xl font-bold text-white mb-6">Utwórz nowy post</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Tytuł <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Wpisz tytuł posta..."
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Opis <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                placeholder="Wpisz opis posta..."
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <FaImage />
                Zdjęcia (max 10)
              </label>
              <div className="space-y-4">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-purple-500/30 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                  <div className="text-center">
                    <FaUpload className="mx-auto text-purple-400 mb-2" size={32} />
                    <span className="text-gray-400">Kliknij aby dodać zdjęcia</span>
                    <p className="text-xs text-gray-500 mt-1">{images.length}/10</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={images.length >= 10}
                  />
                </label>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <FaVideo />
                Filmy (max 5)
              </label>
              <div className="space-y-4">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-blue-500/30 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <FaVideo className="mx-auto text-blue-400 mb-2" size={32} />
                    <span className="text-gray-400">Kliknij aby dodać filmy</span>
                    <p className="text-xs text-gray-500 mt-1">{videos.length}/5</p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoChange}
                    className="hidden"
                    disabled={videos.length >= 5}
                  />
                </label>

                {videoPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {videoPreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <video
                          src={preview}
                          className="w-full h-32 object-cover rounded-lg bg-black"
                          controls
                        />
                        <button
                          type="button"
                          onClick={() => removeVideo(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-purple-500/30 pt-6">
              <h3 className="text-white font-semibold mb-4">Social Media</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={enableFacebook}
                        onChange={(e) => setEnableFacebook(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-6 h-6 rounded-md border-2 border-gray-600 bg-gray-800 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-200 flex items-center justify-center">
                        {enableFacebook && (
                          <motion.svg
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </div>
                    </div>
                    <FaFacebook className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-white group-hover:text-blue-400 transition-colors">Facebook</span>
                  </label>
                  {enableFacebook && (
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      type="url"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="https://facebook.com/..."
                    />
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={enableInstagram}
                        onChange={(e) => setEnableInstagram(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-6 h-6 rounded-md border-2 border-gray-600 bg-gray-800 peer-checked:bg-gradient-to-br peer-checked:from-purple-600 peer-checked:via-pink-600 peer-checked:to-orange-500 peer-checked:border-pink-600 transition-all duration-200 flex items-center justify-center">
                        {enableInstagram && (
                          <motion.svg
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </div>
                    </div>
                    <FaInstagram className="text-pink-500 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-white group-hover:text-pink-400 transition-colors">Instagram</span>
                  </label>
                  {enableInstagram && (
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      type="url"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="https://instagram.com/..."
                    />
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={enableTiktok}
                        onChange={(e) => setEnableTiktok(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-6 h-6 rounded-md border-2 border-gray-600 bg-gray-800 peer-checked:bg-black peer-checked:border-white transition-all duration-200 flex items-center justify-center">
                        {enableTiktok && (
                          <motion.svg
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </div>
                    </div>
                    <FaTiktok className="text-white group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-white group-hover:text-gray-300 transition-colors">TikTok</span>
                  </label>
                  {enableTiktok && (
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      type="url"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                      className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="https://tiktok.com/@..."
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-purple-500/30 pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-6 h-6 rounded-md border-2 border-gray-600 bg-gray-800 peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all duration-200 flex items-center justify-center">
                    {isAnonymous && (
                      <motion.svg
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                </div>
                <span className="text-white group-hover:text-purple-400 transition-colors font-semibold">
                  Anonimowy post
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-2 ml-9">
                Twój post będzie wyświetlany jako "Anonimowy" zamiast Twojego nicku
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                {submitting ? 'Tworzenie...' : 'Utwórz post'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Anuluj
              </motion.button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Post zostanie wysłany do weryfikacji przez administrację
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
