import { create } from 'zustand';

type TUserLocation = {
  latitude: number;
  longitude: number;
};

export type TUserLocationStore = {
  location: TUserLocation;
  setLocation: (user: TUserLocation) => void;
};

export const useUserLocationStore = create<TUserLocationStore>()((set) => ({
  location: { latitude: 0, longitude: 0 },
  setLocation: (location) => set({ location }),
}));
