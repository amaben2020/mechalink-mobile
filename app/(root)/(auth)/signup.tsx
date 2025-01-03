import { Text, ScrollView, Image, View } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { images } from '@/constants/Icons';
import InputField from '@/components/InputField';

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    addressOne: '',
    role: '',
    phone: '',
  });

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
        />
        <InputField
          label="Username"
          placeholder="Enter a Username"
          onChangeText={(text) => setForm({ ...form, username: text })}
        />{' '}
        <InputField
          label="Username"
          placeholder="Enter a Username"
          onChangeText={(text) => setForm({ ...form, username: text })}
        />
      </View>
    </ScrollView>
  );
}
