import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

export type TMechanics = {
  lng: string;
  lat: string;
  id: string;
  username: string;
  distanceAway: number;
  jobCount: number;
  arrivalRate: number;
};

type TMechanicsStore = {
  mechanics: TMechanics[];
  setMechanics: (mechanics: TMechanics[]) => void;
  setMechanic: (mechanic: TMechanics) => void;
};

export const useMechanicsStore = create<TMechanicsStore>()(
  devtools(
    persist(
      (set) => ({
        mechanics: [], // Initialize as an empty array
        setMechanics: (mechanics: TMechanics[]) => set({ mechanics }),
        setMechanic: (mechanic: TMechanics) =>
          set((state) => ({
            mechanics: state.mechanics.map((m) =>
              m.id === mechanic.id ? mechanic : m
            ),
          })),
      }),
      {
        name: 'mechanics-storage',
      }
    )
  )
);
