import { fetchAPI } from '@/lib/fetch';
import { createJobSchema } from '@/schema/createJobSchema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: {
      description: string;
      rate: number;
      latitude: number;
      locationDetails: string;
      longitude: number;
      isPendingReview: boolean;
      status: string;
      userId: number;
    }) => {
      const parsedForm = createJobSchema.safeParse(formData);
      if (!parsedForm.success) {
        throw new Error(JSON.stringify(parsedForm.error.format()));
      }

      return fetchAPI('jobs/jobs', {
        method: 'POST',
        body: JSON.stringify(parsedForm.data),
      });
    },
    onSuccess: (data: any) => {
      if (data?.message?.includes('created')) {
        console.log('Job created successfully:', data);
        // queryClient.invalidateQueries(['jobs']);
      }
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
