import { useState } from 'react';
import toast from 'react-hot-toast';

interface CharacterImageGeneratorProps {
  characterName: string;
  description: string;
  style: string;
  onImageGenerated: (imageUrl: string) => void;
}

export default function CharacterImageGenerator({
  characterName,
  description,
  style,
  onImageGenerated,
}: CharacterImageGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const generateCharacterImage = async () => {
    if (!description.trim()) {
      toast.error('Please provide a character description first');
      return;
    }

    setGenerating(true);
    try {
      // Create a detailed prompt for character generation
      const prompt = `A beautiful portrait of ${characterName}, ${description}, looking directly at the camera, high quality, detailed facial features, professional lighting`;

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

      setPreviewUrl(data.imageUrl);
      onImageGenerated(data.imageUrl);
      toast.success('Character image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate character image');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Character Image</h3>
        <button
          onClick={generateCharacterImage}
          disabled={generating || !description.trim()}
          className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {generating && (
        <div className="flex items-center justify-center rounded-lg bg-dark-200 p-8">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent"></div>
            </div>
            <p className="text-white">Generating your character image...</p>
            <p className="text-sm text-dark-600">This may take a few seconds</p>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="rounded-lg border border-dark-300 bg-dark-200 p-4">
          <img
            src={previewUrl}
            alt={`Generated image of ${characterName}`}
            className="w-full rounded-lg object-cover"
          />
          <p className="mt-2 text-sm text-dark-600">
            Generated using Flux 1 Schnell AI
          </p>
        </div>
      )}

      {!generating && !previewUrl && (
        <div className="rounded-lg border-2 border-dashed border-dark-300 bg-dark-200 p-8 text-center">
          <p className="text-dark-600">
            Click "Generate Image" to create a character portrait using AI
          </p>
        </div>
      )}
    </div>
  );
}
