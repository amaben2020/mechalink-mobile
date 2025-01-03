import {
  Text,
  ScrollView,
  Image,
  View,
  Switch,
  TouchableOpacity,
} from 'react-native';
import React, { Children, useState } from 'react';
import { Link } from 'expo-router';
import { images } from '@/constants/Icons';
import InputField from '@/components/InputField';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ModalComponent from '@/components/Modal';
import { fetchAPI } from '@/lib/fetch';
import { z } from 'zod';

export default function Signup() {
  const [isEnabled, setIsEnabled] = useState(true);

  // Define Zod schema
  const formSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*\d).*$/,
        'Password must include a number and an uppercase letter'
      ),
    addressOne: z.string().min(2, 'Invalid address'),
    role: z.enum(['client', 'mechalink']),
    phone: z.string().min(11, { message: 'Must be 11 digits' }),
  });

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
      const parsedForm = formSchema.safeParse(form);

      if (!parsedForm.success) {
        // Extract error messages
        const newErrors = parsedForm.error.format();
        setErrors(newErrors);
      } else {
        setErrors(null);
        // Handle form submission
        console.log('Form submitted successfully:', form);
      }

      const data = await fetchAPI(
        'https://node-ci-cd-7.onrender.com/api/v1/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(parsedForm.data),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (data?.message.includes('created')) {
        console.log('Yeahhh');
        setIsSuccess(true);
      }
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
          <Text style={{ color: 'red', fontStyle: 'italic', marginTop: -16 }}>
            {errors.username?._errors[0]}
          </Text>
        )}
        <InputField
          label="Email"
          placeholder="Enter a Email"
          onChangeText={(text) => setForm({ ...form, email: text })}
          textContentType="emailAddress"
          value={form?.email}
        />
        {errors?.email && (
          <Text style={{ color: 'red', fontStyle: 'italic', marginTop: -16 }}>
            {errors.email?._errors[0]}
          </Text>
        )}
        <InputField
          label="AddressOne"
          placeholder="Enter a AddressOne"
          onChangeText={(text) => setForm({ ...form, addressOne: text })}
          value={form?.addressOne}
        />{' '}
        {errors?.addressOne && (
          <Text style={{ color: 'red', fontStyle: 'italic', marginTop: -16 }}>
            {errors.addressOne?._errors[0]}
          </Text>
        )}
        <InputField
          label="Phone"
          placeholder="Enter a Phone"
          onChangeText={(text) => setForm({ ...form, phone: text })}
          value={form?.phone}
        />
        {errors?.phone && (
          <Text style={{ color: 'red', fontStyle: 'italic', marginTop: -16 }}>
            {errors.phone?._errors[0]}
          </Text>
        )}
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
            {errors?.role && (
              <Text
                style={{ color: 'red', fontStyle: 'italic', marginTop: -16 }}
              >
                {errors.role?._errors[0]}
              </Text>
            )}

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
          <Text style={{ color: 'red', fontStyle: 'italic', marginTop: -16 }}>
            {errors.password?._errors[0]}
          </Text>
        )}
      </View>

      {true && <ModalComponent />}

      <TouchableOpacity onPress={createUser}>
        <Text>Create User</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
