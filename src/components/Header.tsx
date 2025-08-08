import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-64 right-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sharesome</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link
          href="/auth?mode=register"
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Register for FREE
        </Link>
        <Link
          href="/auth"
          className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}