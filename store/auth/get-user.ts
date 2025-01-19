import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

type TAuth = {
  token: string;
  setToken: (token: string) => void;
  removeToken: () => void;
};

export const useSignupStore = create<TAuth>()(
  // devtools(
  //   persist(
  (set) => ({
    token: '',
    setToken: (token: string) => set({ token }),
    removeToken: () => set({ token: '' }),
  }),
  //     {
  //       name: 'user-storage',
  //     }
  //   )
  // )
);

type TUser = {
  email: string;
  role: string;
  fullName?: string;
  phoneNumber?: string;
  addressOne?: string;
  addressTwo?: string;
  city?: string;
  state?: string;
  username?: string;
  zip?: string;
  country?: string;
  id?: string;
};

export type TUserStore = {
  user: TUser;
  setUser: (user: TUser) => void;
};

export const useUserStore = create<TUserStore>()(
  // devtools(
  //   persist(
  (set) => ({
    user: { email: '', role: '' },
    setUser: (user) => set({ user }),
  }),
  //     {
  //       name: 'user-store',
  //     }
  //   )
  // )
);
