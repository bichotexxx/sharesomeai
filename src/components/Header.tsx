import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-16 right-0 z-10 flex h-16 items-center justify-between border-b border-dark-200 bg-dark-100 px-4">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-1">
          <div className="flex w-full md:ml-0">
            <div className="relative w-full text-dark-600 focus-within:text-dark-500">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                type="search"
                name="search"
                className="block h-10 w-full rounded-full border-0 bg-dark-200 py-1.5 pl-10 pr-3 text-white placeholder:text-dark-500 focus:ring-2 focus:ring-pink-500 sm:text-sm sm:leading-6"
                placeholder="Search characters..."
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center gap-x-4">
          <Link
            href="/create"
            className="flex items-center rounded-full bg-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-600"
          >
            Create Character
            <SparklesIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="rounded-full bg-dark-200 px-6 py-2 text-sm font-semibold text-white hover:bg-dark-300"
          >
            Start Chatting
          </button>
        </div>
      </div>
    </header>
  );
}