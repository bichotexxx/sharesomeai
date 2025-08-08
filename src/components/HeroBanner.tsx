import { SparklesIcon } from '@heroicons/react/24/outline';

export default function HeroBanner() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-r from-pink-600 to-pink-400 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Create AI Characters
            <span className="block">100% Free, No Limits</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/80">
            Generate unlimited AI characters, chat, and create content. No subscriptions, no hidden fees.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/create"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-pink-600 shadow-sm hover:bg-gray-100"
            >
              Start Creating
              <SparklesIcon className="ml-2 -mr-1 inline-block h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-pink-500 to-pink-300 opacity-30 hero-polygon"
        />
      </div>
    </div>
  );
}
