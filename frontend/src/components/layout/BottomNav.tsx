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

function vibrate() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(8);
  }
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-4 h-[60px]">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={vibrate}
              className={cn(
                'flex flex-col items-center justify-center gap-[3px]',
                'active:scale-90 transition-transform duration-75 select-none',
                active ? 'text-rose-600' : 'text-gray-400 hover:text-gray-500'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-10 h-7 rounded-2xl transition-all duration-200',
                active ? 'bg-rose-100' : 'bg-transparent'
              )}>
                <Icon className={cn(
                  'transition-all duration-200',
                  active ? 'h-[22px] w-[22px] stroke-[2.2px]' : 'h-5 w-5 stroke-[1.8px]'
                )} />
              </div>
              <span className={cn(
                'text-[10px] transition-all duration-200 leading-none',
                active ? 'font-semibold' : 'font-medium'
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
