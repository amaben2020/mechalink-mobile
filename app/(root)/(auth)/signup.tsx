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

  const createUser = async () => {
    try {
      const data = await fetchAPI(
        'https://node-ci-cd-7.onrender.com/api/v1/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(form),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('RESPONSE', data);

      if (data?.message.includes('created')) {
        console.log('Yeahhh');
        setIsSuccess(true);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  console.log(isSuccess);

  return (
    <ScrollView className="flex flex-1 bg-white">
      <View className="flex-1">
        <Image source={images.signUpCar} className="h-[250px] z-0 w-full" />
        <Text className="font-bold text-2xl font-JakartaBold pb-3 px-3">
          Create Your Account
        </Text>
      </View>

      <View className="p-3 gap-6">
        <InputField
          label="Username"
          placeholder="Enter a Username"
          onChangeText={(text) => setForm({ ...form, username: text })}
          value={form?.username}
        />
        <InputField
          label="Email"
          placeholder="Enter a Email"
          onChangeText={(text) => setForm({ ...form, email: text })}
          textContentType="emailAddress"
          value={form?.email}
        />
        <InputField
          label="AddressOne"
          placeholder="Enter a AddressOne"
          onChangeText={(text) => setForm({ ...form, addressOne: text })}
          value={form?.addressOne}
        />{' '}
        <InputField
          label="Phone"
          placeholder="Enter a Phone"
          onChangeText={(text) => setForm({ ...form, phone: text })}
          value={form?.phone}
        />
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

            <Text className="block"> {isEnabled ? 'Client' : 'Mechanic'}</Text>
          </View>
        </SafeAreaProvider>
        <InputField
          label="Password"
          placeholder="Enter a Password i.e Password123!"
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
        />{' '}
      </View>

      {isSuccess && <ModalComponent />}

      <TouchableOpacity onPress={createUser}>
        <Text>Create User</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
