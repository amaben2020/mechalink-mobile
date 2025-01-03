import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { onboarding } from '../../../constants/Icons';

const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  return (
    <SafeAreaView className="flex h-full justify-between">
      <Swiper
        loop={false}
        ref={swiperRef}
        dot={
          <View className="w-[32px] mx-1 bg-[#e2e8f0] h-[8px] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] mx-1 bg-primary-500 h-[8px] rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex justify-center h-full p-8 gap-4">
            <Image
              source={item.image}
              className="h-[300px] w-full"
              resizeMode="contain"
            />
            <View>
              <Text className="text-red-700 font-JakartaBold text-2xl">
                {item.title}
              </Text>

              <Text className="text-red-700">{item.description}</Text>
            </View>

            <TouchableOpacity>
              <Text>Next</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Swiper>
    </SafeAreaView>
  );
};

export default Welcome;
