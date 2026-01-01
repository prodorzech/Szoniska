'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Update {
  id: string;
  version: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export default function UserUpdatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await fetch('/api/updates');
      const data = await res.json();
      setUpdates(data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    );
  }

  const pinnedUpdates = updates.filter(u => u.isPinned);
  const regularUpdates = updates.filter(u => !u.isPinned);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Aktualizacje</h1>

        {pinnedUpdates.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📌 Przypięte Aktualizacje
            </h2>
            <div className="space-y-4">
              {pinnedUpdates.map((update) => (
                <UpdateCard key={update.id} update={update} isPinned />
              ))}
            </div>
          </div>
        )}

        {regularUpdates.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Wszystkie Aktualizacje</h2>
            <div className="space-y-4">
              {regularUpdates.map((update) => (
                <UpdateCard key={update.id} update={update} />
              ))}
            </div>
          </div>
        )}

        {updates.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Brak aktualizacji do wyświetlenia.
          </div>
        )}
      </div>
    </div>
  );
}

function UpdateCard({ update, isPinned = false }: { update: Update; isPinned?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border-2 ${
        isPinned ? 'border-yellow-600' : 'border-transparent'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-600 text-sm font-mono rounded">
              v{update.version}
            </span>
            {isPinned && (
              <span className="px-2 py-1 bg-yellow-600 text-xs rounded">📌 Przypięte</span>
            )}
          </div>
          <h3 className="text-xl font-semibold">{update.title}</h3>
        </div>
      </div>

      <div className={`text-gray-300 mb-4 ${!isExpanded && 'line-clamp-3'}`}>
        {update.content.split('\n').map((line, i) => (
          <p key={i} className="mb-2">
            {line}
          </p>
        ))}
      </div>

      {update.content.length > 200 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-400 hover:text-blue-300 text-sm mb-4"
        >
          {isExpanded ? 'Pokaż mniej' : 'Pokaż więcej'}
        </button>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-gray-700 pt-3">
        <span>📅 {new Date(update.createdAt).toLocaleDateString('pl-PL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</span>
        <span>🆔 {update.id}</span>
      </div>
    </div>
  );
}
