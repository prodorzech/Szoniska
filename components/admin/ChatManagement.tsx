'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTrash, FaClock } from 'react-icons/fa';

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
    discordUsername?: string;
  };
}

export default function ChatManagement() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/chat');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Błąd pobierania wiadomości:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Auto-refresh co 10 sekund
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        const newMsg = await response.json();
        setMessages([newMsg, ...messages]);
        setNewMessage('');
      } else {
        alert('Nie udało się wysłać wiadomości');
      }
    } catch (error) {
      console.error('Błąd wysyłania wiadomości:', error);
      alert('Błąd wysyłania wiadomości');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteOldMessages = async () => {
    if (!confirm('Czy na pewno chcesz wyczyścić cały chat? Ta operacja usunie wszystkie wiadomości.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/admin/chat', {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchMessages();
      } else {
        alert('Nie udało się wyczyścić czatu');
      }
    } catch (error) {
      console.error('Błąd czyszczenia czatu:', error);
      alert('Błąd czyszczenia czatu');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Wczoraj ' + date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">Ładowanie czatu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Chat Administracji</h2>
        <button
          onClick={handleDeleteOldMessages}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <FaTrash />
          {deleting ? 'Czyszczenie...' : 'Wyczyść cały chat'}
        </button>
      </div>

      {/* Formularz wysyłania */}
      <form onSubmit={handleSendMessage} className="bg-gray-800 rounded-lg p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Napisz wiadomość..."
            maxLength={1000}
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <FaPaperPlane />
            {sending ? 'Wysyłanie...' : 'Wyślij'}
          </button>
        </div>
        <div className="text-gray-400 text-sm mt-2">
          {newMessage.length}/1000 znaków
        </div>
      </form>

      {/* Lista wiadomości */}
      <div className="bg-gray-800 rounded-lg p-4 h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Brak wiadomości. Wyślij pierwszą wiadomość!
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    {message.user.image ? (
                      <img
                        src={message.user.image}
                        alt={message.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {message.user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold">
                          {message.user.name}
                        </span>
                        {message.user.discordUsername && (
                          <span className="text-gray-400 text-sm">
                            @{message.user.discordUsername}
                          </span>
                        )}
                        <span className="text-gray-400 text-sm">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="text-gray-400 text-sm">
        ℹ️ Chat jest automatycznie czyszczony co 30 dni (wszystkie wiadomości). Tylko administratorzy mogą pisać w tym czacie.
      </div>
    </div>
  );
}
