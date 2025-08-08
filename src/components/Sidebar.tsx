import Link from 'next/link';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  PhotoIcon, 
  PlusIcon, 
  SparklesIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon,
  StarIcon,
  FireIcon,
  CreditCardIcon,
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, active: true },
  { name: 'Discover', href: '/characters', icon: MagnifyingGlassIcon },
  { name: 'My Characters', href: '/characters', icon: UserGroupIcon },
  { name: 'My Gallery', href: '/gallery', icon: PhotoIcon },
  { name: 'Create Character', href: '/create', icon: PlusIcon },
  { name: 'Generate Images', href: '/generate', icon: SparklesIcon },
  { name: 'Hot or Not', href: '/hot-or-not', icon: FireIcon },
  { name: 'Favorites', href: '/favorites', icon: HeartIcon },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftIcon },
  { name: 'Premium', href: '/premium', icon: StarIcon, badge: '100% OFF' },
  { name: 'Buy Flame Credits', href: '/credits', icon: CreditCardIcon },
  { name: 'Sharesome', href: '/sharesome', icon: UserIcon },
  { name: 'Discord', href: '/discord', icon: ChatBubbleLeftRightIcon },
];

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-64 flex flex-col bg-pink-100 border-r border-pink-200">
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-pink-200">
        <Link href="/" className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">Sharesome</h1>
        </Link>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-2 pt-6 px-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-pink-200 text-pink-700' 
                    : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-500 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="flex flex-col gap-2 p-4 border-t border-pink-200">
        <Link
          href="/privacy"
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Terms of Use
        </Link>
      </div>
    </div>
  );
}
