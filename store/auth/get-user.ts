import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

type TAuth = {
  token: string;
  setToken: (token: string) => void;
  removeToken: () => void;
};

export const useSignupStore = create<TAuth>()(
  devtools(
    persist(
      (set) => ({
        token: '',
        setToken: (token: string) => set({ token }),
        removeToken: () => set({ token: '' }),
      }),
      {
        name: 'user-storage',
      }
    )
  )
);
