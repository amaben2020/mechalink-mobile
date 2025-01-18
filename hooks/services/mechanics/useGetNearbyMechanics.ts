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
  return useQuery<{ nearbyMechs: TMechanics[] }, Error>({
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

type TUserJobRequest = {
  jobRequestId: number;
  status: string;
  userId: number;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  userPhone: string;
  country: string;
};

export const useGetUserJobRequest = (userId: string) => {
  return useQuery<TUserJobRequest, Error>({
    queryKey: ['user-jobRequest', userId],
    queryFn: async () => {
      try {
        const response = await fetchAPI(`jobRequests/user/${userId}`);

        return response;
      } catch (error) {
        console.log(error);
      }
    },
  });
};
