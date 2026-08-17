import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Fallback to localStorage if idb-keyval fails, but idb-keyval is preferred for larger data
import { get, set, del } from 'idb-keyval';

// Custom storage for Zustand using IndexedDB
const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

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
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? idbStorage : localStorage as any)),
    }
  )
);
