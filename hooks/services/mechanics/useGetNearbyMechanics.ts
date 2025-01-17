// const mechanicsResponse = await fetchAPI(
//   `nearby-mechanics?radius=${radius}&userId=${userId}`
// );

import { fetchAPI } from '@/lib/fetch';
import { TMechanics } from '@/store/mechanics/mechanics';
import { useQuery } from '@tanstack/react-query';

export const useGetNearbyMechanics = ({
  radius,
  userId,
}: {
  radius: number;
  userId: string;
}) => {
  return useQuery<TMechanics[], Error>({
    queryKey: ['nearbyMechs', userId],
    queryFn: async () => {
      try {
        const mechanicsResponse = await fetchAPI(
          `nearby-mechanics?radius=${radius}&userId=${userId}`
        );

        return mechanicsResponse;
      } catch (error) {
        console.log(error);
      }
    },
  });
};
