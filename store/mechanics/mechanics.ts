import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

type TMechanics = { lng: string; lat: string; id: string; username?: string };
type TMechanicsStore = {
  mechanics: TMechanics[];
  setMechanics: (mechanics: TMechanics[]) => void;
};

export const useMechanicsStore = create<TMechanicsStore>()(
  devtools(
    persist(
      (set) => ({
        mechanics: [
          {
            lng: '',
            lat: '',
            id: '',
          },
        ],
        setMechanics: (mechanics: TMechanics[]) => set({ mechanics }),
      }),
      {
        name: 'mechanics-storage',
      }
    )
  )
);
