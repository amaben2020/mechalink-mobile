import { fetchAPI } from '@/lib/fetch';
import { useQuery } from '@tanstack/react-query';

export const useGetMechanicByUserId = (userId: number) => {
  return useQuery<
    {
      mechanicId: number;
    },
    Error
  >({
    queryKey: ['mechanic-by-userId', userId],
    queryFn: async () => {
      try {
        const response = await fetchAPI(`mechanics/${userId}`);

        return response;
      } catch (error) {
        console.log(error);
      }
    },
  });
};

export const useJobRequestByMechanicId = (mechanicId: number) => {
  return useQuery<
    {
      status: string;
      userId: number;
      id: number;

      location: {
        latitude: number;
        longitude: number;
      };
    },
    Error
  >({
    queryKey: ['mechanic-by-userId', mechanicId],
    queryFn: async () => {
      try {
        const response = await fetchAPI(`jobRequests/${mechanicId}`);

        return response;
      } catch (error) {
        console.log(error);
      }
    },
  });
};
