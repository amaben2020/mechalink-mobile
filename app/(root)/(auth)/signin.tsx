import { Text, ScrollView, Image, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { images } from '@/constants/Icons';
import InputField from '@/components/InputField';
import ModalComponent from '@/components/Modal';
import { fetchAPI } from '@/lib/fetch';
import { z } from 'zod';
import { signinSchema } from '@/schema/signup';
import ErrorText from '@/components/ErrorText';
import { useSignupStore, useUserStore } from '@/store/auth/get-user';

export default function Signin() {
  const [form, setForm] = useState({
    password: ' ',
    email: ' ',
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<z.ZodFormattedError<typeof form> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const [userRole, setUserRole] = useState('');

  const { setToken } = useSignupStore();

  const { setUser } = useUserStore();

  const createUser = async () => {
    setIsLoading(true);
    try {
      const parsedForm = signinSchema.safeParse(form);
      if (!parsedForm.success) {
        const newErrors = parsedForm.error.format();
        setErrors(newErrors);
      } else {
        setErrors(null);
        console.log('Form submitted successfully:', form);
      }

      const data = await fetchAPI(
        'https://node-ci-cd-7.onrender.com/api/v1/auth/signin',
        {
          method: 'POST',
          body: JSON.stringify(parsedForm.data),
        }
      );

      if (data?.user?.apiKey) {
        setIsSuccess(true);

        setToken(data?.user?.stsTokenManager?.accessToken);
        setUserRole(data?.role);
        setUser({
          role: data?.role,
          fullName: data?.fullName,
          phoneNumber: data?.phoneNumber,
          addressOne: data?.addressOne,
          addressTwo: data?.addressTwo,
          city: data?.city,
          state: data?.state,
          username: data?.username,
          zip: data?.zip,
          country: data?.country,
          email: data?.email,
          id: data?.id,
        });
        setIsLoading(false);
      }

      return data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex flex-1 bg-white">
      <View className="flex-1">
        <Image source={images.signUpCar} className="h-[250px] z-0 w-full" />
        <Text className="font-bold text-2xl font-JakartaBold pb-3 px-3">
          Log in
        </Text>
      </View>

      <View className="p-3 gap-5">
        <InputField
          label="Email"
          placeholder="Enter a Email"
          onChangeText={(text) => setForm({ ...form, email: text })}
          textContentType="emailAddress"
          value={form?.email.trim()}
        />
        {errors?.email && <ErrorText message={errors.email?._errors[0]} />}
        <InputField
          label="Password"
          placeholder="Enter a Password i.e Password123!"
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
          value={form.password}
        />{' '}
        {errors?.password && (
          <ErrorText message={errors.password?._errors[0]} />
        )}
      </View>

      {isSuccess && (
        <ModalComponent
          url={
            userRole.includes('client')
              ? '/(root)/(client-tabs)/home'
              : '/(root)/(tabs)/home'
          }
          linkText={`Welcome ${userRole}`}
        />
      )}

      <TouchableOpacity
        disabled={isLoading}
        onPress={createUser}
        className="w-10/12 mx-auto p-4 bg-primary-500 rounded-full mt-5 disabled:bg-primary-300"
      >
        <Text className="text-white font-JakartaExtraBold text-center">
          Sign in
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
