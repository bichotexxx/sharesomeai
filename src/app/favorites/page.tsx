"use client";

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
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

export default function FavoritesPage() {
  const { user } = useAuthContext();
  const [favorites, setFavorites] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      // Get user's favorite character IDs
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('character_id')
        .eq('user_id', user.id);

      if (favoritesError) throw favoritesError;

      if (!favoritesData || favoritesData.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Get character details for favorite IDs
      const characterIds = favoritesData.map(fav => fav.character_id);
      const { data: charactersData, error: charactersError } = await supabase
        .from('characters')
        .select('*')
        .in('id', characterIds);

      if (charactersError) throw charactersError;

      // Add like count and liked status
      const charactersWithLikes = await Promise.all(
        (charactersData || []).map(async (character) => {
          const { count } = await supabase
            .from('favorites')
            .select('*', { count: 'exact', head: true })
            .eq('character_id', character.id);

          return {
            ...character,
            likes_count: count || 0,
            is_liked: true, // These are favorites, so they're liked
          };
        })
      );

      setFavorites(charactersWithLikes);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (characterId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('character_id', characterId)
        .eq('user_id', user.id);

      // Remove from local state
      setFavorites(prev => prev.filter(char => char.id !== characterId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Error removing from favorites');
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
    window.location.href = `/chat?character=${character.id}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Sidebar />
        <Header />
        <main className="pl-16 pt-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-white mb-4">Please log in to view your favorites</p>
              <a
                href="/auth"
                className="inline-block rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-400"
              >
                Sign In
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Sidebar />
        <Header />
        <main className="pl-16 pt-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-white">Loading favorites...</p>
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
            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
            <p className="mt-2 text-dark-600">Characters you've liked and saved</p>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <HeartIcon className="h-16 w-16 text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No favorites yet</h3>
              <p className="text-dark-600 mb-4">
                Start exploring characters and add them to your favorites
              </p>
              <a
                href="/characters"
                className="inline-block rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-400"
              >
                Explore Characters
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {favorites.map((character) => (
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
                          onClick={() => removeFavorite(character.id)}
                          className="flex items-center space-x-1 text-pink-500 hover:text-pink-400 transition-colors"
                          title="Remove from favorites"
                        >
                          <HeartSolidIcon className="h-5 w-5" />
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
