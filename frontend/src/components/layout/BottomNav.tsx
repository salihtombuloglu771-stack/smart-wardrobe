'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Shirt, Sparkles, CalendarDays, User } from 'lucide-react';

const navItems = [
  { href: '/wardrobe', label: 'Gardırop', icon: Shirt },
  { href: '/outfit', label: 'Kombin', icon: Sparkles },
  { href: '/calendar', label: 'Takvim', icon: CalendarDays },
  { href: '/profile', label: 'Profil', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 transition-colors',
                active ? 'text-rose-600' : 'text-gray-400'
              )}
            >
              <div className={cn('p-1.5 rounded-xl transition-colors', active && 'bg-rose-50')}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
