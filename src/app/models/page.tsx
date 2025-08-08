"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { HeartIcon, ShareIcon, StarIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface CivitAIModel {
  id: number;
  name: string;
  description: string;
  type: string;
  nsfw: boolean;
  tags: string[];
  modelVersions: {
    id: number;
    name: string;
    description: string;
    baseModel: string;
    downloadUrl: string;
    files: {
      id: number;
      name: string;
      sizeKB: number;
      type: string;
      hashes: {
        SHA256: string;
      };
    }[];
  }[];
  creator: {
    username: string;
    image: string;
  };
  stats: {
    downloadCount: number;
    rating: number;
    ratingCount: number;
  };
  images: {
    id: number;
    url: string;
    width: number;
    height: number;
    nsfw: boolean;
    hash: string;
    meta: {
      prompt?: string;
      negativePrompt?: string;
      cfgScale?: number;
      steps?: number;
      sampler?: string;
      seed?: number;
    };
  }[];
}

export default function ModelsPage() {
  const [models, setModels] = useState<CivitAIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/civitai/models?limit=20');
      const data = await response.json();

      if (data.success) {
        setModels(data.models);
      } else {
        console.error('Failed to fetch models');
        toast.error('Failed to load models');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Error loading models');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchModels();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/civitai/models?query=${encodeURIComponent(searchQuery)}&limit=20`);
      const data = await response.json();

      if (data.success) {
        setModels(data.models);
      } else {
        toast.error('No models found for your search');
      }
    } catch (error) {
      console.error('Error searching models:', error);
      toast.error('Error searching models');
    } finally {
      setLoading(false);
    }
  };

  const shareModel = async (model: CivitAIModel) => {
    try {
      const shareData = {
        title: `Check out ${model.name} on CivitAI`,
        text: model.description,
        url: `https://civitai.com/models/${model.id}`,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Model link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Error sharing model');
    }
  };

  const filteredModels = models.filter(model => {
    if (selectedType !== 'all' && model.type !== selectedType) {
      return false;
    }
    return true;
  });

  const modelTypes = [
    { key: 'all', label: 'All Types' },
    { key: 'Checkpoint', label: 'Checkpoint' },
    { key: 'TextualInversion', label: 'Textual Inversion' },
    { key: 'Hypernetwork', label: 'Hypernetwork' },
    { key: 'AestheticGradient', label: 'Aesthetic Gradient' },
    { key: 'LORA', label: 'LoRA' },
    { key: 'Controlnet', label: 'Controlnet' },
  ];

  return (
    <div className="min-h-screen bg-dark-100">
      <Sidebar />
      <Header />
      
      <main className="pl-16 pt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">AI Models</h1>
            <p className="mt-2 text-dark-600">Discover popular AI models from CivitAI</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded-md border-0 bg-dark-200 px-4 py-2 text-white placeholder:text-dark-500 focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="rounded-md bg-pink-500 px-6 py-2 text-white hover:bg-pink-600 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {modelTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() => setSelectedType(type.key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type.key
                      ? 'bg-pink-500 text-white'
                      : 'bg-dark-200 text-white hover:bg-dark-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-white">Loading models...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <div key={model.id} className="rounded-lg bg-dark-200 overflow-hidden hover:bg-dark-300 transition-colors">
                  {/* Model Image */}
                  {model.images && model.images.length > 0 && (
                    <div className="relative aspect-video">
                      <img
                        src={model.images[0].url}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded">
                          {model.type}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Model Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {model.name}
                    </h3>
                    
                    <p className="text-sm text-dark-600 mb-3 line-clamp-3">
                      {model.description}
                    </p>

                    {/* Creator */}
                    <div className="flex items-center space-x-2 mb-3">
                      {model.creator?.image && (
                        <img
                          src={model.creator.image}
                          alt={model.creator.username}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-sm text-white">by {model.creator?.username || 'Unknown'}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <StarIcon className="h-4 w-4" />
                          <span className="text-white">{model.stats?.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-400">
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          <span className="text-white">{model.stats?.downloadCount?.toLocaleString() || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {model.tags && model.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {model.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-dark-300 text-white text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {model.tags.length > 3 && (
                          <span className="bg-dark-300 text-white text-xs px-2 py-1 rounded">
                            +{model.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <button
                        className="flex items-center space-x-1 text-white hover:text-pink-500 transition-colors"
                        title="Add to favorites"
                      >
                        <HeartIcon className="h-4 w-4" />
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <a
                          href={`https://civitai.com/models/${model.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md bg-pink-500 px-3 py-1 text-xs text-white hover:bg-pink-600 transition-colors"
                        >
                          View on CivitAI
                        </a>
                        <button
                          onClick={() => shareModel(model)}
                          className="rounded-md bg-dark-300 px-3 py-1 text-xs text-white hover:bg-dark-400 transition-colors"
                          title="Share model"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredModels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-600 mb-4">No models found</p>
              <button
                onClick={fetchModels}
                className="rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-400"
              >
                Load More Models
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
