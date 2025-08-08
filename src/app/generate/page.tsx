"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style,
          width: 1024,
          height: 1024,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.imageUrl);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="min-h-screen bg-dark-100">
      <Sidebar />
      <Header />
      
      <main className="pl-16 pt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Generate AI Images</h1>
            <p className="mt-2 text-dark-600">Create stunning character images using Flux 1 Schnell AI</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Generation Form */}
            <div className="space-y-6">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-white">
                    Image Prompt
                  </label>
                  <textarea
                    id="prompt"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mt-1 block w-full rounded-md border-0 bg-dark-200 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-dark-300 focus:ring-2 focus:ring-inset focus:ring-pink-500"
                    placeholder="Describe the character you want to generate... (e.g., 'A beautiful woman with long brown hair, green eyes, wearing a red dress')"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="style" className="block text-sm font-medium text-white">
                    Art Style
                  </label>
                  <select
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-0 bg-dark-200 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-dark-300 focus:ring-2 focus:ring-inset focus:ring-pink-500"
                  >
                    <option value="realistic">Realistic</option>
                    <option value="anime">Anime</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="fantasy">Fantasy</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={generating}
                  className="w-full rounded-md bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate Image'}
                </button>
              </form>

              {/* Tips */}
              <div className="rounded-lg bg-dark-200 p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Tips for Better Results</h3>
                <ul className="space-y-2 text-sm text-dark-600">
                  <li>• Be specific about appearance details</li>
                  <li>• Include clothing and accessories</li>
                  <li>• Mention lighting and mood</li>
                  <li>• Add background details if desired</li>
                </ul>
              </div>
            </div>

            {/* Generated Image */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Generated Image</h2>
              
              {generating && (
                <div className="flex items-center justify-center rounded-lg bg-dark-200 p-12">
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="h-12 w-12 animate-spin rounded-full border-2 border-pink-500 border-t-transparent"></div>
                    </div>
                    <p className="text-white">Generating your image...</p>
                    <p className="text-sm text-dark-600">This may take a few seconds</p>
                  </div>
                </div>
              )}

              {generatedImage && !generating && (
                <div className="space-y-4">
                  <img
                    src={generatedImage}
                    alt="Generated AI image"
                    className="w-full rounded-lg object-cover"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadImage}
                      className="flex-1 rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-400"
                    >
                      Download Image
                    </button>
                    <button
                      onClick={() => setGeneratedImage(null)}
                      className="rounded-md bg-dark-200 px-4 py-2 text-sm font-semibold text-white hover:bg-dark-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {!generating && !generatedImage && (
                <div className="rounded-lg border-2 border-dashed border-dark-300 bg-dark-200 p-12 text-center">
                  <p className="text-dark-600">
                    Your generated image will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
