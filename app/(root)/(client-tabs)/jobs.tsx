import ErrorText from '@/components/ErrorText';
import InputField from '@/components/InputField';
import ClientLayout from '@/components/layout/ClientLayout';
import ModalComponent from '@/components/Modal';
import { fetchAPI } from '@/lib/fetch';
import { createJobSchema } from '@/schema/createJobSchema';
import { useUserStore } from '@/store/auth/get-user';
import { useUserLocationStore } from '@/store/location/location';
import { useState } from 'react';
import { Image, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { z } from 'zod';

export default function JobsScreen() {
  const { user } = useUserStore();
  console.log(user.id);
  const { location } = useUserLocationStore();
  const [form, setForm] = useState({
    description: '',
    rate: 0,
    latitude: location.latitude,
    locationDetails: '',
    longitude: location.longitude,
    isPendingReview: false,
    status: 'NOTIFYING',
    userId: Number(user.id),
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<z.ZodFormattedError<typeof form> | null>(
    null
  );

  const createJob = async () => {
    try {
      const parsedForm = createJobSchema.safeParse(form);
      console.log(parsedForm);
      if (!parsedForm.success) {
        const newErrors = parsedForm.error.format();
        setErrors(newErrors);
      } else {
        setErrors(null);
        console.log('Job created successfully:', form);
      }

      const data = await fetchAPI(
        'https://node-ci-cd-7.onrender.com/api/v1/jobs/jobs',
        {
          method: 'POST',
          body: JSON.stringify(parsedForm.data),
        }
      );

      if (data?.message.includes('created')) setIsSuccess(true);

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ClientLayout>
      <Text className="font-JakartaBold text-center text-xl">Jobs</Text>

      <ScrollView className="flex flex-col rounded-md p-4 mt-3">
        <Text className="font-bold text-2xl text-center font-JakartaBold pb-3 px-3">
          Create a Job
        </Text>
        {/* TODO: Add dropdown of issue type */}
        <View className="p-3 gap-5">
          <InputField
            label="Description"
            placeholder="Enter job description"
            onChangeText={(text) => setForm({ ...form, description: text })}
            value={form?.description}
          />
          {errors?.description && (
            <ErrorText message={errors.description?._errors[0]} />
          )}

          <InputField
            label="Rate"
            placeholder="Enter job rate"
            onChangeText={(text) => setForm({ ...form, rate: Number(text) })}
            value={Number(form?.rate)}
            keyboardType="numeric"
          />
          {errors?.rate && <ErrorText message={errors.rate?._errors[0]} />}

          <InputField
            label="Location Details"
            placeholder="Enter location details"
            onChangeText={(text) => setForm({ ...form, locationDetails: text })}
            value={form?.locationDetails}
          />
          {errors?.locationDetails && (
            <ErrorText message={errors.locationDetails?._errors[0]} />
          )}

          <TouchableOpacity
            onPress={createJob}
            className="mt-5 bg-primary-500 rounded-full p-3"
          >
            <Text className="text-center text-white">Create Job</Text>
          </TouchableOpacity>
        </View>

        {isSuccess && <ModalComponent />}
      </ScrollView>
    </ClientLayout>
  );
}
