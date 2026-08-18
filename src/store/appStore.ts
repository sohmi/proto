import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  phone: string;
  role: 'citizen' | 'admin' | 'staff';
  full_name?: string;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  language: string;
  setLanguage: (lang: string) => void;
  // Offline cache
  cachedNotices: any[];
  setCachedNotices: (notices: any[]) => void;
  cachedRequests: any[];
  setCachedRequests: (requests: any[]) => void;
}

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      language: 'hi',
      setLanguage: (language) => set({ language }),
      cachedNotices: [],
      setCachedNotices: (cachedNotices) => set({ cachedNotices }),
      cachedRequests: [],
      setCachedRequests: (cachedRequests) => set({ cachedRequests }),
    }),
    {
      name: 'ai-panchayat-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : dummyStorage as any)),
    }
  )
);
