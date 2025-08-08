"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CharacterCard from '@/components/CharacterCard';
import HeroBanner from '@/components/HeroBanner';
import { HeartIcon, ShareIcon, ChatBubbleLeftIcon, StarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface CivitAICharacter {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  prompt: string;
  negativePrompt: string;
  modelName: string;
  creator: string;
  tags: string[];
  stats?: {
    downloadCount: number;
    rating: number;
    ratingCount: number;
  };
}

const features = [
  {
    name: 'Unlimited Characters',
    description: 'Create as many AI characters as you want, completely free',
  },
  {
    name: 'Unrestricted Chat',
    description: 'Chat with any character without message limits',
  },
  {
    name: 'Full Resolution',
    description: 'Download images in full quality, no watermarks',
  },
  {
    name: 'All Styles Available',
    description: 'Access to all art styles and character customization options',
  },
];

export default function Home() {
  const [civitaiCharacters, setCivitaiCharacters] = useState<CivitAICharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCivitAICharacters();
  }, []);

  const fetchCivitAICharacters = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/civitai/characters?limit=12');
      const data = await response.json();

      if (data.success) {
        setCivitaiCharacters(data.characters);
      } else {
        console.error('Failed to fetch CivitAI characters');
        setCivitaiCharacters(getFallbackCharacters());
      }
    } catch (error) {
      console.error('Error fetching CivitAI characters:', error);
      setCivitaiCharacters(getFallbackCharacters());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackCharacters = (): CivitAICharacter[] => [
    {
      id: 1,
      name: 'Luna',
      imageUrl: '/characters/luna.jpg',
      description: 'A mysterious elf from the enchanted forest.',
      prompt: 'beautiful elf, long hair, fantasy, high quality',
      negativePrompt: 'low quality, blurry',
      modelName: 'Fantasy Character',
      creator: 'AI Artist',
      tags: ['fantasy', 'elf', 'beautiful'],
    },
    {
      id: 2,
      name: 'Max',
      imageUrl: '/characters/max.jpg',
      description: 'A charismatic adventurer with a hidden past.',
      prompt: 'handsome adventurer, rugged, charismatic',
      negativePrompt: 'low quality, blurry',
      modelName: 'Adventure Character',
      creator: 'AI Artist',
      tags: ['adventure', 'handsome', 'rugged'],
    },
    {
      id: 3,
      name: 'Seraphina',
      imageUrl: '/characters/seraphina.jpg',
      description: 'An angelic being with a fiery spirit.',
      prompt: 'angelic being, beautiful, ethereal, wings',
      negativePrompt: 'low quality, blurry',
      modelName: 'Divine Character',
      creator: 'AI Artist',
      tags: ['angelic', 'beautiful', 'ethereal'],
    },
    {
      id: 4,
      name: 'Kaito',
      imageUrl: '/characters/kaito.jpg',
      description: 'A skilled ninja with a calm demeanor.',
      prompt: 'ninja warrior, skilled, calm, mysterious',
      negativePrompt: 'low quality, blurry',
      modelName: 'Ninja Character',
      creator: 'AI Artist',
      tags: ['ninja', 'warrior', 'mysterious'],
    },
    {
      id: 5,
      name: 'Elara',
      imageUrl: '/characters/elara.jpg',
      description: 'A wise sorceress with ancient knowledge.',
      prompt: 'wise sorceress, magical, ancient knowledge',
      negativePrompt: 'low quality, blurry',
      modelName: 'Magic Character',
      creator: 'AI Artist',
      tags: ['sorceress', 'magical', 'wise'],
    },
    {
      id: 6,
      name: 'Jax',
      imageUrl: '/characters/jax.jpg',
      description: 'A rugged mercenary with a heart of gold.',
      prompt: 'rugged mercenary, tough, heart of gold',
      negativePrompt: 'low quality, blurry',
      modelName: 'Mercenary Character',
      creator: 'AI Artist',
      tags: ['mercenary', 'rugged', 'tough'],
    },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchCivitAICharacters();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/civitai/characters?query=${encodeURIComponent(searchQuery)}&limit=12`);
      const data = await response.json();

      if (data.success) {
        setCivitaiCharacters(data.characters);
      } else {
        toast.error('No characters found for your search');
      }
    } catch (error) {
      console.error('Error searching characters:', error);
      toast.error('Error searching characters');
    } finally {
      setLoading(false);
    }
  };

  const shareCharacter = async (character: CivitAICharacter) => {
    try {
      const shareData = {
        title: `Check out ${character.name} on CloneSome AI`,
        text: character.description,
        url: `${window.location.origin}/characters/${character.id}`,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Character link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Error sharing character');
    }
  };

  const startChat = (character: CivitAICharacter) => {
    window.location.href = `/chat?character=${character.id}`;
  };

  return (
    <div className="min-h-screen bg-dark-100">
      <Sidebar />
      <Header />
      
      <main className="pl-16 pt-16">
        <HeroBanner />
        
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            {/* Features Section */}
            <section className="py-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className="rounded-lg bg-dark-200 p-6 hover:bg-dark-300 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white">{feature.name}</h3>
                    <p className="mt-2 text-sm text-dark-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Characters Section */}
            <section>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Popular AI Characters</h2>
                  <p className="text-dark-600 mt-1">Discover amazing AI characters from CivitAI</p>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-500" />
                    <input
                      type="text"
                      placeholder="Search characters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 rounded-md border-0 bg-dark-200 px-3 py-2 text-white placeholder:text-dark-500 focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white">Loading characters...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {civitaiCharacters.map((character) => (
                    <div key={character.id} className="group relative overflow-hidden rounded-lg bg-dark-200">
                      <div className="aspect-h-4 aspect-w-3 relative">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white mb-1">{character.name}</h3>
                        <p className="text-sm text-white/80 mb-2 line-clamp-2">
                          {character.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <StarIcon className="h-4 w-4" />
                            <span className="text-xs text-white">
                              {character.stats?.rating?.toFixed(1) || '4.5'}
                            </span>
                          </div>
                          <div className="text-xs text-white/60">
                            by {character.creator}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              className="flex items-center space-x-1 text-white hover:text-pink-500 transition-colors"
                              title="Add to favorites"
                            >
                              <HeartIcon className="h-4 w-4" />
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

              {!loading && civitaiCharacters.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-dark-600 mb-4">No characters found</p>
                  <button
                    onClick={fetchCivitAICharacters}
                    className="rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-400"
                  >
                    Load More Characters
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}