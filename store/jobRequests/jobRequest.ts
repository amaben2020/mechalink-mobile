import { create } from 'zustand';

type TJobRequest = {
  latitude: number;
  longitude: number;
};

export type TJobRequestStore = {
  location: TJobRequest;
  setJobRequest: (user: TJobRequest) => void;
};

export const useJobRequestStore = create<TJobRequestStore>()((set) => ({
  location: { latitude: 0, longitude: 0 },
  setJobRequest: (location) => set({ location }),
}));
