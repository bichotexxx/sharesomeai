"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  is_character: boolean;
  created_at: string;
}

interface Character {
  id: string;
  name: string;
  image_url: string;
  personality: string;
}

export default function ChatPage() {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('is_public', true)
        .limit(10);

      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      toast.error('Error loading characters');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !selectedCharacter || !user) return;

    setLoading(true);
    const userMessage = currentMessage;
    setCurrentMessage('');

    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      is_character: false,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Simulate AI response (in a real app, this would call an AI API)
      const aiResponse = await generateAIResponse(userMessage, selectedCharacter.personality);
      
      const newAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        is_character: true,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newAIMessage]);

      // Save messages to database
      await supabase.from('messages').insert([
        { chat_id: 'temp', content: userMessage, is_character: false },
        { chat_id: 'temp', content: aiResponse, is_character: true },
      ]);

    } catch (error) {
      toast.error('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = async (userMessage: string, personality: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          characterPersonality: personality,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate response');
      }

      return data.response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm having trouble responding right now. Could you try again?";
    }
  };

  return (
    <div className="min-h-screen bg-dark-100">
      <Sidebar />
      <Header />
      
      <main className="pl-16 pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Character Selection Sidebar */}
          <div className="w-80 border-r border-dark-200 bg-dark-100 p-4">
            <h2 className="mb-4 text-lg font-semibold text-white">Choose a Character</h2>
            <div className="space-y-2">
              {characters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacter(character)}
                  className={`w-full rounded-lg p-3 text-left transition-colors ${
                    selectedCharacter?.id === character.id
                      ? 'bg-pink-500 text-white'
                      : 'bg-dark-200 text-white hover:bg-dark-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={character.image_url}
                      alt={character.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{character.name}</div>
                      <div className="text-xs opacity-75">
                        {character.personality.substring(0, 50)}...
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-1 flex-col">
            {selectedCharacter ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-dark-200 bg-dark-100 p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedCharacter.image_url}
                      alt={selectedCharacter.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{selectedCharacter.name}</h3>
                      <p className="text-sm text-dark-600">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.is_character ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          message.is_character
                            ? 'bg-dark-200 text-white'
                            : 'bg-pink-500 text-white'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-dark-200 rounded-lg px-4 py-2 text-white">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white animation-delay-100"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-white animation-delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-dark-200 bg-dark-100 p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border-0 bg-dark-200 px-4 py-2 text-white placeholder:text-dark-500 focus:ring-2 focus:ring-pink-500"
                      disabled={loading}
                    />
                                         <button
                       type="submit"
                       disabled={loading || !currentMessage.trim()}
                       className="rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 disabled:opacity-50"
                       aria-label="Send message"
                     >
                       <PaperAirplaneIcon className="h-5 w-5" />
                     </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">Select a Character</h3>
                  <p className="text-dark-600">Choose a character from the sidebar to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
