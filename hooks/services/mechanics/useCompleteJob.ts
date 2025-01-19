import { fetchAPI } from '@/lib/fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCompleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: number) => {
      return fetchAPI(`jobs/mechanics/8/7`, {
        method: 'PUT',
        body: JSON.stringify({}),
      });
    },
    onSuccess: (data: any) => {
      console.log('Success', data);
      //@ts-ignore
      queryClient.invalidateQueries(['job']);
    },
    onError: (error: any) => {
      console.error('Job creation failed:', error);
    },
    onMutate: () => {
      console.log('Loading...');
      // toast.loading('Please wait for search result');
    },
    onSettled: () => {
      console.log('Done ✅');
      // toast.dismiss();
    },
  });
};
