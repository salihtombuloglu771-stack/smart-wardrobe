import { create } from 'zustand';
import { User } from '@/types';
import { authApi, usersApi } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; name: string; password: string; city?: string }) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('sw_token') : null,
  loading: false,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('sw_token', data.access_token);
      set({ token: data.access_token });
      const profile = await usersApi.getProfile();
      set({ user: profile.data, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const { data: res } = await authApi.register(data);
      localStorage.setItem('sw_token', res.access_token);
      set({ token: res.access_token });
      const profile = await usersApi.getProfile();
      set({ user: profile.data, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem('sw_token');
    set({ user: null, token: null });
    window.location.href = '/login';
  },

  fetchProfile: async () => {
    const token = localStorage.getItem('sw_token');
    if (!token) return;
    try {
      const { data } = await usersApi.getProfile();
      set({ user: data });
    } catch {
      localStorage.removeItem('sw_token');
      set({ user: null, token: null });
    }
  },
}));
