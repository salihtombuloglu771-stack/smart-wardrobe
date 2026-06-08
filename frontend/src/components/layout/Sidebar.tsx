'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Shirt, Sparkles, CalendarDays, BarChart3, User, LogOut, Home } from 'lucide-react';

const navItems = [
  { href: '/wardrobe', label: 'Gardırop', icon: Shirt },
  { href: '/outfit', label: 'Kombin Üret', icon: Sparkles },
  { href: '/calendar', label: 'Takvim', icon: CalendarDays },
  { href: '/profile', label: 'Profil & Analiz', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-100 rounded-lg">
            <Shirt className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Smart Wardrobe</p>
            <p className="text-xs text-muted-foreground">AI Asistanı</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-rose-50 text-rose-700'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-rose-100 text-rose-700 text-xs">
              {user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.city || 'Şehir belirtilmemiş'}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-red-600" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" /> Çıkış Yap
        </Button>
      </div>
    </aside>
  );
}
