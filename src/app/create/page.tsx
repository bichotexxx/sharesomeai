"use client";

import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CharacterImageGenerator from '@/components/CharacterImageGenerator';

export default function CreateCharacterPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [characterData, setCharacterData] = useState({
    name: '',
    description: '',
    personality: '',
    style: 'realistic',
    isPublic: true,
    image_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('characters')
        .insert([
          {
            ...characterData,
            creator_id: user.id,
            image_url: characterData.image_url || '/placeholder-character.jpg',
          },
        ]);

      if (error) throw error;
      toast.success('Character created successfully!');
      // Reset form
      setCharacterData({
        name: '',
        description: '',
        personality: '',
        style: 'realistic',
        isPublic: true,
        image_url: '',
      });
    } catch (error) {
      toast.error('Error creating character');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-100">
      <Sidebar />
      <Header />
      
      <main className="pl-16 pt-16">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Create Your AI Character</h1>
            <p className="mt-2 text-dark-600">Design a unique AI character with custom personality and style</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Character Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={characterData.name}
                  onChange={(e) => setCharacterData({ ...characterData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-0 bg-dark-200 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-dark-300 focus:ring-2 focus:ring-inset focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="style" className="block text-sm font-medium text-white">
                  Art Style
                </label>
                <select
                  id="style"
                  value={characterData.style}
                  onChange={(e) => setCharacterData({ ...characterData, style: e.target.value })}
                  className="mt-1 block w-full rounded-md border-0 bg-dark-200 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-dark-300 focus:ring-2 focus:ring-inset focus:ring-pink-500"
                >
                  <option value="realistic">Realistic</option>
                  <option value="anime">Anime</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="fantasy">Fantasy</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={characterData.description}
                onChange={(e) => setCharacterData({ ...characterData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-0 bg-dark-200 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-dark-300 focus:ring-2 focus:ring-inset focus:ring-pink-500"
                placeholder="Describe your character's appearance and traits..."
                required
              />
            </div>

            <div>
              <label htmlFor="personality" className="block text-sm font-medium text-white">
                Personality
              </label>
              <textarea
                id="personality"
                rows={4}
                value={characterData.personality}
                onChange={(e) => setCharacterData({ ...characterData, personality: e.target.value })}
                className="mt-1 block w-full rounded-md border-0 bg-dark-200 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-dark-300 focus:ring-2 focus:ring-inset focus:ring-pink-500"
                placeholder="Define your character's personality, behavior, and conversation style..."
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                checked={characterData.isPublic}
                onChange={(e) => setCharacterData({ ...characterData, isPublic: e.target.checked })}
                className="h-4 w-4 rounded border-dark-300 text-pink-500 focus:ring-pink-500"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-white">
                Make character public (visible to other users)
              </label>
            </div>

            {/* Character Image Generator */}
            <CharacterImageGenerator
              characterName={characterData.name}
              description={characterData.description}
              style={characterData.style}
              onImageGenerated={(imageUrl) => setCharacterData({ ...characterData, image_url: imageUrl })}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Character'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
