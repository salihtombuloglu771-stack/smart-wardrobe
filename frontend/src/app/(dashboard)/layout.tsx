'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageTransition } from '@/components/layout/PageTransition';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token && !user) router.replace('/login');
  }, [user, token, router]);

  if (!token && !user) return null;

  return (
    <div className="flex min-h-[100dvh] bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNav />
    </div>
  );
}
