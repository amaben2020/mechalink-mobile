import {
  Text,
  ScrollView,
  Image,
  View,
  Switch,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { images } from '@/constants/Icons';
import InputField from '@/components/InputField';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ModalComponent from '@/components/Modal';
import { fetchAPI } from '@/lib/fetch';
import { z } from 'zod';
import { signupSchema } from '@/schema/signup';
import ErrorText from '@/components/ErrorText';
import { Link } from 'expo-router';

export default function Signup() {
  const [isEnabled, setIsEnabled] = useState(true);

  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    addressOne: '',
    role: isEnabled ? 'client' : 'mechanic',
    phone: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<z.ZodFormattedError<typeof form> | null>(
    null
  );

  const createUser = async () => {
    try {
      const parsedForm = signupSchema.safeParse(form);
      if (!parsedForm.success) {
        const newErrors = parsedForm.error.format();
        setErrors(newErrors);
      } else {
        setErrors(null);
        console.log('Form submitted successfully:', form);
      }

      const data = await fetchAPI('auth/register', {
        method: 'POST',
        body: JSON.stringify(parsedForm.data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (data?.message.includes('created')) setIsSuccess(true);

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView className="flex flex-1 bg-white">
      <View className="flex-1">
        <Image source={images.signUpCar} className="h-[250px] z-0 w-full" />
        <Text className="font-bold text-2xl font-JakartaBold pb-3 px-3">
          Create Your Account
        </Text>
      </View>

      <View className="p-3 gap-5">
        <InputField
          label="Username"
          placeholder="Enter a Username"
          onChangeText={(text) => setForm({ ...form, username: text })}
          value={form?.username}
        />
        {errors?.username && (
          <ErrorText message={errors.username?._errors[0]} />
        )}
        <InputField
          label="Email"
          placeholder="Enter a Email"
          onChangeText={(text) => setForm({ ...form, email: text })}
          textContentType="emailAddress"
          value={form?.email}
        />
        {errors?.email && <ErrorText message={errors.email?._errors[0]} />}
        <InputField
          label="AddressOne"
          placeholder="Enter a AddressOne"
          onChangeText={(text) => setForm({ ...form, addressOne: text })}
          value={form?.addressOne}
        />{' '}
        {errors?.addressOne && (
          <ErrorText message={errors.addressOne?._errors[0]} />
        )}
        <InputField
          label="Phone"
          placeholder="Enter a Phone"
          onChangeText={(text) => setForm({ ...form, phone: text })}
          value={form?.phone}
        />
        {errors?.phone && <ErrorText message={errors.phone?._errors[0]} />}
        <SafeAreaProvider>
          <View className="flex-1 flex">
            <Switch
              trackColor={{
                false: '#1E3A8A',
                true: '#d3d3d3',
              }}
              thumbColor={true ? '#1E3A8A' : '#d3d3d3'}
              ios_backgroundColor="#d4d4d4"
              onValueChange={() =>
                setIsEnabled((previousState) => !previousState)
              }
              value={isEnabled}
            />
            {errors?.role && <ErrorText message={errors.role?._errors[0]} />}

            <Text className="block"> {isEnabled ? 'Client' : 'Mechanic'}</Text>
          </View>
        </SafeAreaProvider>
        <InputField
          label="Password"
          placeholder="Enter a Password i.e Password123!"
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
        />{' '}
        {errors?.password && (
          <ErrorText message={errors.password?._errors[0]} />
        )}
      </View>

      {isSuccess && <ModalComponent />}

      <TouchableOpacity onPress={createUser}>
        <Text>Create User</Text>
      </TouchableOpacity>

      <Text>
        Already have an account?{' '}
        <Link href="/(root)/(auth)/signin">Sign in</Link>
      </Text>
      {/* TODO: REMOVE */}
      <Text>
        Already have an account?{' '}
        <Link href="/(root)/(client-tabs)/home">kEEP WORKING</Link>
      </Text>
    </ScrollView>
  );
}
