"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { HeartIcon, StarIcon, ChatBubbleLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Character {
  id: number;
  name: string;
  age: string;
  imageUrl: string;
  description: string;
}

const featuredCharacters: Character[] = [
  {
    id: 1,
    name: 'Fiona',
    age: '18 years',
    imageUrl: '/characters/fiona.jpg',
    description: 'A mysterious elf from the enchanted forest'
  },
  {
    id: 2,
    name: 'Kendall Parker',
    age: '24 years',
    imageUrl: '/characters/kendall.jpg',
    description: 'A charismatic adventurer with a hidden past'
  },
  {
    id: 3,
    name: 'Bella Dolphins',
    age: '25 years',
    imageUrl: '/characters/bella.jpg',
    description: 'An angelic being with a fiery spirit'
  },
  {
    id: 4,
    name: 'Ariella Martinez',
    age: '22 years',
    imageUrl: '/characters/ariella.jpg',
    description: 'A skilled ninja with a calm demeanor'
  }
];

export default function Home() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (characterId: number) => {
    setFavorites(prev => 
      prev.includes(characterId) 
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
    toast.success(favorites.includes(characterId) ? 'Removed from favorites' : 'Added to favorites');
  };

  const startChat = (character: Character) => {
    window.location.href = `/chat?character=${character.id}`;
  };

  const createCharacter = () => {
    window.location.href = '/create';
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <Header />
      
      <main className="pl-64 pt-16">
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-r from-pink-400 to-red-500 px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="inline-block bg-pink-500 text-white text-xs px-3 py-1 rounded-full mb-4">
                  Initial Launch Offer
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-4">
                  Create your own <span className="text-pink-200">AI Character</span>
                </h1>
                
                <p className="text-white/90 text-lg mb-8 max-w-2xl">
                  Introducing Sharesome AI: Your ultimate AI Character Creator. Customize personalities, clothes and more to create your personal and unique Sharesome AI character, you can chat and interact with.
                </p>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={createCharacter}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Create AI Character
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Start Chatting
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex justify-end space-x-4">
                <div className="relative">
                  <img 
                    src="/characters/hero-1.jpg" 
                    alt="AI Character" 
                    className="w-48 h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="relative">
                  <img 
                    src="/characters/hero-2.jpg" 
                    alt="AI Character" 
                    className="w-48 h-64 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 right-8">
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Get up to 50% OFF
            </button>
          </div>
        </section>

        {/* Featured Characters Section */}
        <section className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Explore our best <span className="text-pink-500">AI Characters</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCharacters.map((character) => (
                <div key={character.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                  <div className="relative">
                    <img 
                      src={character.imageUrl} 
                      alt={character.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => toggleFavorite(character.id)}
                        className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-colors"
                        title="Add to favorites"
                      >
                        {favorites.includes(character.id) ? (
                          <HeartSolidIcon className="h-4 w-4" />
                        ) : (
                          <HeartIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button 
                        className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full transition-colors"
                        title="Rate character"
                      >
                        <StarIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Chat button */}
                    <div className="absolute bottom-2 right-2">
                      <button
                        onClick={() => startChat(character)}
                        className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-colors"
                        title="Chat with character"
                      >
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{character.name}</h3>
                    <p className="text-sm text-gray-600">{character.age}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}