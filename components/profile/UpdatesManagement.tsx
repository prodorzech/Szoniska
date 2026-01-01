'use client';

import { useState, useEffect } from 'react';

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

export default function UpdatesManagement() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [formData, setFormData] = useState({
    version: '',
    title: '',
    content: '',
    isPinned: false,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingUpdate ? `/api/updates/${editingUpdate.id}` : '/api/updates';
      const method = editingUpdate ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingUpdate(null);
        setFormData({ version: '', title: '', content: '', isPinned: false });
        fetchUpdates();
      } else {
        alert('Błąd podczas zapisywania aktualizacji');
      }
    } catch (error) {
      console.error('Error saving update:', error);
      alert('Błąd podczas zapisywania aktualizacji');
    }
  };

  const handleEdit = (update: Update) => {
    setEditingUpdate(update);
    setFormData({
      version: update.version,
      title: update.title,
      content: update.content,
      isPinned: update.isPinned,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę aktualizację?')) return;

    try {
      const res = await fetch(`/api/updates/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchUpdates();
      } else {
        alert('Błąd podczas usuwania aktualizacji');
      }
    } catch (error) {
      console.error('Error deleting update:', error);
      alert('Błąd podczas usuwania aktualizacji');
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const res = await fetch(`/api/updates/${id}/pin`, {
        method: 'PATCH',
      });

      if (res.ok) {
        fetchUpdates();
      } else {
        alert('Błąd podczas przypinania aktualizacji');
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      alert('Błąd podczas przypinania aktualizacji');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Zarządzanie Aktualizacjami</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingUpdate(null);
            setFormData({ version: '', title: '', content: '', isPinned: false });
          }}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          {showForm ? 'Anuluj' : '+ Nowa Aktualizacja'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {editingUpdate ? 'Edytuj Aktualizację' : 'Nowa Aktualizacja'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Wersja</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="np. 1.0.0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tytuł</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Tytuł aktualizacji"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Treść</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px]"
                placeholder="Treść aktualizacji..."
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPinned"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600"
              />
              <label htmlFor="isPinned" className="ml-2 text-sm">
                Przypnij aktualizację
              </label>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
            >
              {editingUpdate ? 'Zapisz Zmiany' : 'Utwórz Aktualizację'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Wersja</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tytuł</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {updates.map((update) => (
              <tr key={update.id} className="hover:bg-gray-750">
                <td className="px-6 py-4 text-sm font-mono">{update.version}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {update.title}
                    {update.isPinned && (
                      <span className="px-2 py-1 bg-yellow-600 text-xs rounded">📌 Przypięte</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(update.createdAt).toLocaleDateString('pl-PL')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-xs text-gray-500">ID: {update.id}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleTogglePin(update.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        update.isPinned
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {update.isPinned ? 'Odepnij' : 'Przypnij'}
                    </button>
                    <button
                      onClick={() => handleEdit(update)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDelete(update.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      Usuń
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {updates.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Brak aktualizacji. Utwórz pierwszą aktualizację.
          </div>
        )}
      </div>
    </div>
  );
}
