'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const fetchProfile = useAuthStore(s => s.fetchProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, [fetchProfile]);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
