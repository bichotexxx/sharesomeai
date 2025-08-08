import Link from 'next/link';
import { HomeIcon, UserGroupIcon, ChatBubbleLeftIcon, HeartIcon, CogIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'My Characters', href: '/characters', icon: UserGroupIcon },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftIcon },
  { name: 'Generate Images', href: '/generate', icon: CogIcon },
  { name: 'AI Models', href: '/models', icon: CogIcon },
  { name: 'Favorites', href: '/favorites', icon: HeartIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-16 flex flex-col bg-dark-100 border-r border-dark-200">
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-dark-200">
        <Link href="/" className="flex items-center">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="CloneSome AI"
          />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7 pt-6">
          <li>
            <ul role="list" className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-center p-3 text-dark-600 hover:bg-dark-200 hover:text-pink-500"
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
      <div className="flex h-16 shrink-0 items-center justify-center border-t border-dark-200">
        <button
          type="button"
          className="rounded-full bg-dark-200 p-2 text-dark-600 hover:text-pink-500"
        >
          <span className="sr-only">View profile</span>
          <UserGroupIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
