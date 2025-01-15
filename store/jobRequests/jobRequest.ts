import { create } from 'zustand';

type TJobRequest = {
  id: number;
  created_by: string;
  created_at: string;
  updated_by: string | null;
  updated_at: string | null;
  status: string;
  jobId: number;
  mechanicId: number;
  userId: number;
  distance: string;
  duration: string;
};

export type TJobRequestStore = {
  jobRequest: TJobRequest[];
  setJobRequest: (jobRequest: TJobRequest[]) => void;
};

export const useJobRequestStore = create<TJobRequestStore>()((set) => ({
  jobRequest: [
    {
      id: 0,
      created_by: '',
      created_at: '',
      updated_by: null,
      updated_at: null,
      status: '',
      jobId: 0,
      mechanicId: 0,
      userId: 0,
      distance: '',
      duration: '',
    },
  ],
  setJobRequest: (jobRequest) => set({ jobRequest }),
}));
