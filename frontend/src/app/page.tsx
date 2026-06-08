'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function Home() {
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token || user) {
      router.replace('/wardrobe');
    } else {
      router.replace('/login');
    }
  }, [user, token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
