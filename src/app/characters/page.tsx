"use client";

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CharacterCard from '@/components/CharacterCard';
import { HeartIcon, ShareIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Character {
  id: string;
  name: string;
  description: string;
  image_url: string;
  personality: string;
  style: string;
  is_public: boolean;
  creator_id: string;
  created_at: string;
  likes_count?: number;
  is_liked?: boolean;
}

export default function CharactersPage() {
  const { user } = useAuthContext();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my' | 'public'>('all');

  useEffect(() => {
    fetchCharacters();
  }, [filter]);

  const fetchCharacters = async () => {
    try {
      let query = supabase.from('characters').select('*');
      
      if (filter === 'my' && user) {
        query = query.eq('creator_id', user.id);
      } else if (filter === 'public') {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch likes for each character
      const charactersWithLikes = await Promise.all(
        (data || []).map(async (character) => {
          const { count } = await supabase
            .from('favorites')
            .select('*', { count: 'exact', head: true })
            .eq('character_id', character.id);

          const isLiked = user ? await checkIfLiked(character.id) : false;

          return {
            ...character,
            likes_count: count || 0,
            is_liked: isLiked,
          };
        })
      );

      setCharacters(charactersWithLikes);
    } catch (error) {
      console.error('Error fetching characters:', error);
      toast.error('Error loading characters');
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = async (characterId: string): Promise<boolean> => {
    if (!user) return false;
    
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('character_id', characterId)
      .eq('user_id', user.id)
      .single();

    return !!data;
  };

  const toggleLike = async (characterId: string) => {
    if (!user) {
      toast.error('Please log in to like characters');
      return;
    }

    try {
      const isLiked = await checkIfLiked(characterId);

      if (isLiked) {
        // Unlike
        await supabase
          .from('favorites')
          .delete()
          .eq('character_id', characterId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('favorites')
          .insert([{ character_id: characterId, user_id: user.id }]);
      }

      // Update local state
      setCharacters(prev =>
        prev.map(char =>
          char.id === characterId
            ? {
                ...char,
                likes_count: isLiked ? (char.likes_count || 1) - 1 : (char.likes_count || 0) + 1,
                is_liked: !isLiked,
              }
            : char
        )
      );

      toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Error updating favorite');
    }
  };

  const shareCharacter = async (character: Character) => {
    try {
      const shareData = {
        title: `Check out ${character.name} on CloneSome AI`,
        text: character.description,
        url: `${window.location.origin}/characters/${character.id}`,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Character link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Error sharing character');
    }
  };

  const startChat = (character: Character) => {
    // Navigate to chat with this character
    window.location.href = `/chat?character=${character.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Sidebar />
        <Header />
        <main className="pl-16 pt-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-white">Loading characters...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <Sidebar />
      <Header />
      
      <main className="pl-16 pt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Characters</h1>
            <p className="mt-2 text-dark-600">Discover and manage AI characters</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-dark-200 rounded-lg p-1">
              {[
                { key: 'all', label: 'All Characters' },
                { key: 'my', label: 'My Characters' },
                { key: 'public', label: 'Public Characters' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-pink-500 text-white'
                      : 'text-dark-600 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Characters Grid */}
          {characters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-600">No characters found</p>
              <a
                href="/create"
                className="inline-block mt-4 rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-400"
              >
                Create Your First Character
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {characters.map((character) => (
                <div key={character.id} className="group relative overflow-hidden rounded-lg bg-dark-200">
                  <div className="aspect-h-4 aspect-w-3 relative">
                    <img
                      src={character.image_url}
                      alt={character.name}
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{character.name}</h3>
                    <p className="text-sm text-white/80 mb-3 line-clamp-2">
                      {character.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleLike(character.id)}
                          className="flex items-center space-x-1 text-white hover:text-pink-500 transition-colors"
                        >
                          {character.is_liked ? (
                            <HeartSolidIcon className="h-5 w-5 text-pink-500" />
                          ) : (
                            <HeartIcon className="h-5 w-5" />
                          )}
                          <span className="text-sm">{character.likes_count || 0}</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startChat(character)}
                          className="rounded-full bg-pink-500 p-2 text-white hover:bg-pink-600 transition-colors"
                          title="Chat with character"
                        >
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => shareCharacter(character)}
                          className="rounded-full bg-dark-300 p-2 text-white hover:bg-dark-400 transition-colors"
                          title="Share character"
                        >
                          <ShareIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
