import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface CharacterCardProps {
  name: string;
  image: string;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onChat?: () => void;
}

export default function CharacterCard({ name, image, isFavorite = false, onFavorite, onChat }: CharacterCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-dark-200">
      <div className="aspect-h-4 aspect-w-3 relative">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={onFavorite}
              className="rounded-full bg-dark-100/50 p-2 text-white hover:bg-pink-500/50"
              aria-label={`${isFavorite ? 'Remove from favorites' : 'Add to favorites'}`}
            >
              {isFavorite ? (
                <HeartSolidIcon className="h-5 w-5 text-pink-500" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={onChat}
              className="rounded-full bg-dark-100/50 p-2 text-white hover:bg-pink-500/50"
              aria-label={`Chat with ${name}`}
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}