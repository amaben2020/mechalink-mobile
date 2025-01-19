import { fetchAPI } from '@/lib/fetch';
import { useQuery } from '@tanstack/react-query';

export const useGetJobById = (jobId: number) => {
  return useQuery<
    {
      mechanicId: number;
    },
    Error
  >({
    queryKey: ['job'],
    queryFn: async () => {
      try {
        const response = await fetchAPI(`jobs/job/8`);

        return response;
      } catch (error) {
        console.log(error);
      }
    },
  });
};
