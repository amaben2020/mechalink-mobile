import { fetchAPI } from '@/lib/fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useApproveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: number) => {
      return fetchAPI(`jobs/8`, {
        method: 'PUT',
        body: JSON.stringify({}),
      });
    },
    onSuccess: (data: any) => {
      console.log('Success', data);
      // queryClient.invalidateQueries(['jobs']);
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
