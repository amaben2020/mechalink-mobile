import { Tabs } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, Platform, View } from 'react-native';

import { icons } from '@/constants/Icons';

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    style={
      Platform.OS === 'android'
        ? {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 30,
            borderRadius: 24,
          }
        : {}
    }
    className={`flex flex-row justify-center items-center rounded-full ${
      focused ? 'bg-general-400' : ''
    }`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${
        focused ? 'bg-general-400' : ''
      }`}
    >
      <Image
        source={source}
        tintColor="white"
        resizeMode="contain"
        className="w-7 h-7 rounded"
      />
    </View>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#333333',
          borderRadius: 50,
          height: 78,
          marginHorizontal: 20,
          marginBottom: 20,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          paddingVertical: 10,
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
