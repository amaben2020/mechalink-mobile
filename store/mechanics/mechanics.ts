// import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

export type TMechanics = {
  lng: string;
  lat: string;
  id: string;
  mechanicId: string;
  username: string;
  distanceAway: number;
  jobCount: number;
  arrivalRate: number;
  phone: number;
};

type TMechanicsStore = {
  mechanics: TMechanics[];
  mechanic: TMechanics;
  setMechanics: (mechanics: TMechanics[]) => void;
  setMechanic: (mechanic: TMechanics) => void;
};

export const useMechanicsStore = create<TMechanicsStore>()(
  // devtools(
  //   persist(
  (set) => ({
    mechanics: [],
    //@ts-ignore
    mechanic: {},
    setMechanics: (mechanics: TMechanics[]) => set({ mechanics }),
    setMechanic: (mechanic: TMechanics) =>
      set((state) => ({
        mechanic: state.mechanics.find((m) => m.id === mechanic.id),
      })),
  })
  // {
  //   name: 'mechanics-storage',
  // }
  //   )
  // )
);
