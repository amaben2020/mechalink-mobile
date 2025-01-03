import { onboarding } from '@/constants/Icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const isLastSlide = activeIndex === onboarding.length - 1;
  const router = useRouter();
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
          <View
            key={item.id}
            className="flex justify-center h-full py-20 px-8 gap-4"
          >
            <TouchableOpacity
              className="  text-black justify-self-end"
              onPress={() => {
                router.replace('/(root)/(auth)/signup');
              }}
            >
              <Text className="text-black text-right font-bold text-xl">
                Skip
              </Text>
            </TouchableOpacity>
            <Image
              source={item.image}
              className="h-[300px] w-full"
              resizeMode="contain"
            />
            <View className="gap-5 text-center  my-auto">
              <Text className="text-[#212121] text-center font-JakartaBold text-5xl">
                {item.title}
              </Text>

              <Text className="text-[#858585] text-center font-JakartaBold text-2xl">
                {item.description}
              </Text>
            </View>

            <TouchableOpacity
              className="w-11/12 mt-auto bg-primary-500 p-4 rounded-full  mb-5"
              onPress={() => {
                isLastSlide
                  ? router.replace('/(root)/(auth)/signup')
                  : swiperRef.current?.scrollBy(1);
              }}
            >
              <Text className="text-white font-bold text-xl text-center">
                {isLastSlide ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </Swiper>
    </SafeAreaView>
  );
};

export default Welcome;
